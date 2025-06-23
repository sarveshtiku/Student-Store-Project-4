// src/components/PaymentInfo/PaymentInfo.jsx
import React from "react"
import "./PaymentInfo.css"

export default function PaymentInfo({
  userInfo = { name: "", dorm_number: "" },    // ① safe default
  setUserInfo,
  handleOnCheckout,
  isCheckingOut,
  error,
}) {
  return (
    <div className="PaymentInfo">
      <h3>
        Payment Info{" "}
        <span className="button">
          <i className="material-icons md-48">monetization_on</i>
        </span>
      </h3>

      <div className="input-field">
        <label className="label">Student ID</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Student ID"
            value={userInfo.name}
            onChange={(e) =>
              setUserInfo((u) => ({ ...u, name: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="input-field">
        <label className="label">Dorm Room Number</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Dorm Room Number"
            value={userInfo.dorm_number}           // ② fixed field
            onChange={(e) =>
              setUserInfo((u) => ({ ...u, dorm_number: e.target.value }))
            }
          />
        </div>
      </div>

      <p className="is-danger">{error}</p>

      <div className="field">
        <div className="control">
          <button
            type="button"                        // ③ prevent form submit
            className="button"
            disabled={isCheckingOut}
            onClick={handleOnCheckout}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
