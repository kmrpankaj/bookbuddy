import React, {useContext, useState} from 'react'
import AlertContext from '../context/AlertContext'
import Sidedash from './Sidedash'

const CreateCoupons = () => {
    const host = process.env.REACT_APP_BACKEND_URL;
    const {showAlert} = useContext(AlertContext)
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'amount', // Initial discount type
        discountValue: '',
        expirationDate: '',
        createdBy: '',
        usageLimit: '',
        isActive: true
    })

    const handleChange = (e) => {
        const { type, name, value, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : value;

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: updatedValue
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Handle 'unlimited' usageLimit scenario
        const submissionData = {
            ...formData,
            usageLimit: formData.usageLimit ? formData.usageLimit : null  // Convert empty string or similar falsy value to null
        };

        try {
            const response = await fetch(`${host}/coupons/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": localStorage.getItem('token'), // Authorization token
                },
                body: JSON.stringify(submissionData)
            });
            
            if(!response.ok) {
                throw new Error('HTTP error', + response.status);
            }
            const data = await response.json();
            //add alert message
            showAlert("Coupon created successfully", "success")
            // Reset the form data on successfull sumission
            setFormData({
                code: '',
                description: '',
                discountType: 'amount', // Initial discount type
                discountValue: '',
                expirationDate: '',
                createdBy: '',
                usageLimit: '',
                isActive: true
            })
            

        } catch (error) {
            console.error('Error creating coupon:', error)
             //add alert message
             showAlert(`Error creating coupon: ${error}`, "danger")

        }
    }

  return (
    <div className="container-fluid">
        <div className="row">
        <Sidedash />
        <div className="col-md-9 pt-3">
            <h2>Create Discount Coupon</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="code" className="form-label">Coupon Code</label>
                    <input type="text" className="form-control" id="code" name="code" value={formData.code} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
                </div>
                <div className="mb-3">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="discountType" id="amount" value="amount"
                            checked={formData.discountType === 'amount'} onChange={handleChange} />
                        <label className="form-check-label" htmlFor="amount">Amount</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="discountType" id="percentage" value="percentage"
                            checked={formData.discountType === 'percentage'} onChange={handleChange} />
                        <label className="form-check-label" htmlFor="percentage">Percentage</label>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="discountValue" className="form-label">{formData.discountType === 'amount' ? 'Amount (₹)' : 'Percentage (%)'}</label>
                    <input type="number" className="form-control" id="discountValue" name="discountValue" value={formData.discountValue} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
                    <input type="date" className="form-control" id="expirationDate" name="expirationDate" value={formData.expirationDate} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="usageLimit" className="form-label">Usage Limit</label>
                    <input type="number" className="form-control" id="usageLimit" name="usageLimit" value={formData.usageLimit} onChange={handleChange} />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="isActive">Is Active</label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>
    </div>
  )
}

export default CreateCoupons