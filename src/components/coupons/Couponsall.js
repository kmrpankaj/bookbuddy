import React, { useState, useEffect, useContext } from 'react'
import Sidedash from '../uicomponents/Sidedash';
import AlertContext from '../../context/AlertContext';
import { formatDate } from '../utils/Utilsfunc';

const Couponsall = () => {
    const host = process.env.REACT_APP_BACKEND_URL;
    const { showAlert } = useContext(AlertContext)
    const couponsdata = []
    const [coupons, setCoupons] = useState(couponsdata)
    const studentNameCache = {};

    const getAllCoupons = async () => {
        try {
            const response = await fetch(`${host}/coupons/fetchcoupons`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                }
            })
            const json = await response.json();
            const couponsWithStudent = await Promise.all(json.map(async (coupon) => {
                try {
                    const studentName = await getStudentName(coupon.createdBy);
                    return { ...coupon, studentName };
                } catch (error) {
                    console.error(`Error fetching student name for ID ${coupon.createdBy}:`, error);
                    // Set a default value (e.g., "Name Unavailable") for studentName
                    return { ...coupon, studentName: "Name Unavailable" };
                }
            }));


            setCoupons(couponsWithStudent)
        } catch (error) {
            console.error("Error fetching all coupons:", error)
        }
    }

    const getStudentName = async (studentId) => {
        if (studentNameCache[studentId]) {
            return studentNameCache[studentId];
        }

        try {
            const response = await fetch(`${host}/students/show/${studentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const studentData = await response.json();
            const studentName = studentData.name;
            studentNameCache[studentId] = studentName; // Cache the student name
            return studentName;
        } catch (error) {
            console.error(`Error fetching student name for ID ${studentId}:`, error);
            return 'Unknown';
        }
    }

    // toggle coupon status
    const toggleCouponStatus = async (couponId, currentStatus) => {
        try {
            const response = await fetch(`${host}/coupons/toggleStatus/${couponId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    couponStatus: !currentStatus,
                })
            })

            if(!response.ok) {
                throw new Error('Network response was not ok')
            }

            const responseData = await response.json();

            if(responseData.success) {
                setCoupons(coupons.map(coupon => {
                    if(coupon._id === couponId) {
                        return { ...coupon, isActive: !currentStatus };
                    }
                    return coupon
                }))
                showAlert("Coupon status changed", "success")
            } else {
                // Handle any error messages from the server
                console.error('Failed to update coupon status:', responseData.error);
            }
            
        } catch (error) {
            console.error('Error toggling coupon status:', error);
        }
    }


    // Delete a coupon
    const deleteCoupon = async (id) => {
        try {
            const response = await fetch(`${host}/coupons/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                }
            })
            const json = await response.json()
            if(response.ok) {
                const newCouponsData = coupons.filter(coupon => coupon._id !== id)
                showAlert("Coupon deleted!", "success")
                setCoupons(newCouponsData)
            } else {
                console.error("Failed to delete the coupon:", json);
            }

        } catch (error) {
            console.error("Error deleting coupon:", error)
        }
        
    }

    useEffect(() => {
        getAllCoupons();
    }, [])

    return (
        <div className='container-fluid'>
            <div className='row'>
                <Sidedash />
                <div className="col-md-9 pt-3">
                    <div className="row">
                        {coupons.map((coupon) => {
                            return (
                                <>
                                    <div key={coupon._id} className='col-md-4 col-xl-4'>

                                        <div className="coupon-card">
                                            <div className="coupon-title">Edit | <span className='cursor-pointer' onClick={()=>{deleteCoupon(coupon._id)}}>Delete</span></div>
                                            <div className="coupon-discount">{(coupon.discountType==="amount"?"₹":"%") + "" + coupon.discountValue} OFF</div>
                                            <div className="coupon-detail">{coupon.description}</div>
                                            <div className="coupon-code">Times used: {coupon.timesUsed}</div>
                                            <div className="coupon-code">Restrictions: {coupon.productRestriction}</div>
                                            <div className="coupon-code">Usage Limit: {(coupon.usageLimit===null?"Unlimited":coupon.usageLimit)}</div>
                                            <div className="coupon-code">Expiration Date: {(coupon.expirationDate===null?"Unlimited":formatDate(coupon.expirationDate))}</div>
                                            <div className="coupon-code">Created By: {coupon.studentName}</div>
                                            <p onClick={() => {toggleCouponStatus(coupon._id, coupon.isActive)}} className="cursor-pointer">Status: <span className='badge badge-info'>{coupon.isActive?"Active":"Inactive"}</span></p>
                                            <p className="coupon-cta">{coupon.code}</p>
                                        </div>
                                        
                                    </div>
                                    

                                </>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Couponsall