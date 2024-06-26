import React, { useEffect, useState } from 'react'
import Sidedash from './Sidedash'
import { formatDate } from './Utilsfunc';

const ActivityLog = () => {
    const host = process.env.REACT_APP_BACKEND_URL;
    const [logData, setLogData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null); // Clear any previous errors

            try {
                const response = await fetch(`${host}/activity/getlog`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token'),
                    }
                })
                const data = await response.json();
                setLogData(data);
            } catch (error) {
                console.error('Error fetching activity log:', error);
                setError('Failed to load activity log. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);


    function humanReadableAuditLog(change, collectionName, affactedDoc) {
        if (!change.path || !collectionName) {
            return null; // Handle missing data gracefully
        }

        const pathParts = change.path.slice(1); // Skip leading empty element
        const changedField = pathParts.join('.');
        const changeFieldStudents = change.path[0]
        //console.log(changedField, "ChangeField")
        //console.log(pathParts, "Pathparts")
        //console.log(change.path[2], 'hellohi why')
        let message = '';
        switch (collectionName) {

            case 'seats':
                //const seatNumber = change.originalSeatNumber;
                const period = change.path[1]; // Assuming night is the second element
                //console.log(period, "hello period")
                message = `Seat number ${affactedDoc} - `;

                switch (change.kind) {
                    case 'E': // Edit
                        if (change.lhs === change.rhs) {
                            return null; // No actual change, skip logging
                        }

                        if (changedField.includes('status')) {
                            message += `${period} slot ${change.lhs ? 'became available' : 'was reserved'}.`;
                        } else if (changedField.includes('bookedBy')) {
                            if (change.lhs) {
                                message += `student ${change.lhs} has been removed from ${period} slot.`;
                            } else {
                                message += `${period} slot has been assigned to the user "${change.rhs}".`;
                            }
                        } else if (changedField.includes('seatValidTill')) {
                            if (change.lhs !== null && change.rhs === null) {
                                message += `validity ${change.lhs ? formatDate(change.lhs) : change.lhs} has been removed.`;
                            } else if (change.lhs === null && change.rhs !== null) {
                                message += `validity has been assigned to ${change.rhs ? formatDate(change.rhs) : change.rhs}.`;
                            } else if (change.lhs !== null && change.rhs !== null) {
                                message += `validity has been updated from ${change.lhs ? formatDate(change.lhs) : change.lhs} to ${change.rhs ? formatDate(change.rhs) : change.rhs}.`; // Human-readable date format
                            }
                        } else {
                            // Handle other potential changes within seatStatus
                            message += `${changedField} changed from "${change.lhs}" to "${change.rhs}".`;
                        }
                        break;
                    case 'N': // New (not applicable for seatStatus edits)
                        break;
                    case 'D': // Delete (not applicable for seatStatus edits)
                        break;
                    default:
                        console.warn(`Unknown change kind: ${change.kind}`); // Log a warning for unexpected kinds
                }
                break;
            case 'students':
                //console.log(changedField, "insidestudent")
                const studentId = affactedDoc || 'Unknown Student'; // Handle missing originalStudentId
                if (change.kind === 'E') {
                    message = `Student ${studentId} - ${changeFieldStudents} changed from "${change.lhs}" to "${change.rhs}".`;
                } else if (change.kind === 'D') {
                    message = `Student ${studentId} has been deleted.`;
                } else {
                    console.warn(`Unknown change kind: ${change.kind} for students`);
                }
                break;
            default:
                console.warn(`Unsupported collection: ${collectionName}`);
        }

        return message.trim() ? <li key={change.path}>{message}</li> : null;
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = logData.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Render page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(logData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }


    // Deleting a log ==========================
    const deleteALog = async (id) => {
        try {
            const response = await fetch(`${host}/activity/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                }
            })
            const json = await response.json()
            if (response.ok) {
                const newActivityData = logData.filter(log => log._id !== id)

                setLogData(newActivityData)
            } else {
                console.error("Failed to delete the log:", json);
            }

        } catch (error) {
            console.error("Error deleting log:", error)
        }
    }

    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <Sidedash />
                    <div className="col-md-10 pt-3">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header text-center">Activity Log</div>
                                    <div className='card-body'>
                                        <div className='table-responsive'>
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th colSpan="2" scope="col">Date</th>
                                                        <th scope="col">User</th>
                                                        <th scope="col">Operation</th>
                                                        <th scope="col">Where</th>
                                                        <th scope="col">Changes</th>
                                                        <th scope="col">Delete</th>
                                                    </tr>
                                                </thead>
                                                {currentItems && currentItems.length > 0 ? (
                                                    <tbody>
                                                        {currentItems.map((log, index) => (
                                                            <tr key={log._id}>
                                                                <th scope="row">{(currentPage - 1) * itemsPerPage + index + 1}</th>
                                                                <td colSpan="2">{formatDate(log.operationDate)}</td>
                                                                <td>{log.operatedBy}</td>
                                                                <td>
                                                                    <p>{log.operationType === 'PATCH' ? "UPDATED" : log.operationType}</p>
                                                                </td>
                                                                <td>{log.collectionName}</td>
                                                                <td>
                                                                    <ul>
                                                                        {log.changes && log.changes.map((change, idx) => (
                                                                            <li key={idx}>
                                                                                {/* Call humanReadableAuditLog here */}
                                                                                {humanReadableAuditLog(change, log.collectionName, log.affactedDoc)}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </td>
                                                                <td>
                                                                    <span className='px-1' title='Unassign' role="button" type="button" data-bs-dismiss="modal" onClick={() => { deleteALog(log._id) }}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                                        </svg>
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                ) : (
                                                    // Display a message if logData is empty or not an array
                                                    <p>No activity log data found.</p>
                                                )}
                                            </table>
                                            <nav>
                                                <ul className='pagination'>
                                                    {pageNumbers.map(number => (
                                                        <li key={number} className='page-item'>
                                                            <a onClick={(e) => {
                                                                e.preventDefault(); // This prevents the default action
                                                                paginate(number);
                                                            }} href="#" className='page-link'>
                                                                {number}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ActivityLog