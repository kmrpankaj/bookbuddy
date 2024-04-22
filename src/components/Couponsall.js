import React, { useState, useEffect } from 'react'
import Sidedash from './Sidedash';

const Couponsall = () => {
    const host = process.env.REACT_APP_BACKEND_URL;
    const couponsdata = []
    const [coupons, setCoupons] = useState(couponsdata)

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
                const studentName = await getStudentName(coupon.createdBy);
                return { ...coupon, studentName }
            }))


            setCoupons(couponsWithStudent)
        } catch (error) {
            console.error("Error fetching all coupons:", error)
        }
    }

    const getStudentName = async (studentId) => {
        const response = await fetch(`${host}/students/show/${studentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token'),
            }
        })
        if(!response.ok){
            throw new Error('Network response was not ok');    
        }
        const studentData = await response.json();
        return studentData.name;
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

                                        <div class="coupon-card">
                                            <div class="coupon-title">Edit | <span className='cursor-pointer' onClick={()=>{deleteCoupon(coupon._id)}}>Delete</span></div>
                                            <div class="coupon-discount">{coupon.discountValue + '' + (coupon.discountType==="amount"?"₹":"%")} OFF</div>
                                            <div class="coupon-detail">{coupon.description}</div>
                                            <div className="coupon-code">Times used: {coupon.timesUsed}</div>
                                            <div className="coupon-code">Usage Limit: {(coupon.usageLimit===null?"Unlimited":coupon.usageLimit)}</div>
                                            <div className="coupon-code">Created By: {coupon.studentName}</div>
                                            <p onClick={() => {toggleCouponStatus(coupon._id, coupon.isActive)}} className="cursor-pointer">Status: <span className='badge badge-info'>{coupon.isActive?"Active":"Inactive"}</span></p>
                                            <p class="coupon-cta">{coupon.code}</p>
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