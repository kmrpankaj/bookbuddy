import React, {useContext, useState} from 'react'
import AlertContext from '../context/AlertContext'
import Sidedash from './Sidedash'

const CreateCoupons = () => {
    const {showAlert} = useContext(AlertContext)
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'amount', // Initial discount type
        discountValue: '',
        expirationDate: '',
        usageLimit: '',
        isActive: true
    })

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked: e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/coupons/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if(!response.ok) {
                throw new Error('HTTP error', + response.status);
            }
            const data = await response.json();
            console.log(data, "coupon created successfully");
            
            //add alert message

        } catch (error) {
            console.error('Error creating coupon:', error)
             //add alert message

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