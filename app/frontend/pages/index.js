import { useState } from 'react'

const OPTIONS = {
  yesno: ['Yes', 'No'],
  gender: ['Female', 'Male'],
  multipleLines: ['No phone service', 'No', 'Yes'],
  internet: ['DSL', 'Fiber optic', 'No'],
  onoff: ['Yes', 'No', 'No internet service'],
  contract: ['Month-to-month', 'One year', 'Two year'],
  payment: ['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)']
}

function Field({ label, name, error, children }) {
  return (
    <div className="field">
      <label className="label" htmlFor={name}>{label}</label>
      {children}
      {error && (
        <div id={`err-${name}`} className="fieldError" role="alert" style={{ color: '#b00020', fontWeight: 600 }}>
          {error}
        </div>
      )}
    </div>
  )
}

export default function PredictPage() {
  // Start with empty values — user must fill the form (no defaults)
  const [form, setForm] = useState({
    gender: '',
    SeniorCitizen: '',
    Partner: '',
    Dependents: '',
    tenure: '',
    PhoneService: '',
    MultipleLines: '',
    InternetService: '',
    OnlineSecurity: '',
    OnlineBackup: '',
    DeviceProtection: '',
    TechSupport: '',
    StreamingTV: '',
    StreamingMovies: '',
    Contract: '',
    PaperlessBilling: '',
    PaymentMethod: '',
    MonthlyCharges: '',
    TotalCharges: ''
  })

  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  function setField(name, value) {
    setForm(prev => ({ ...prev, [name]: value }))
    // clear inline error for this field when user changes it
    setErrors(prev => {
      if (!prev || !prev[name]) return prev
      const copy = { ...prev }
      delete copy[name]
      return copy
    })
  }

  function validateForm() {
    const next = {}
    // require all fields for now
    Object.keys(form).forEach(key => {
      const val = form[key]
      // numeric checks for certain fields
      if (['tenure', 'MonthlyCharges', 'TotalCharges'].includes(key)) {
        if (val === '' || val === null || val === undefined || isNaN(Number(val))) {
          next[key] = 'Please enter a valid value'
        }
      } else {
        if (val === '' || val === null || val === undefined) {
          next[key] = 'This field is required'
        }
      }
    })
    return next
  }

  function fillExample() {
    setForm({
      gender: 'Male',
      SeniorCitizen: 0,
      Partner: 'Yes',
      Dependents: 'No',
      tenure: 12,
      PhoneService: 'Yes',
      MultipleLines: 'No',
      InternetService: 'DSL',
      OnlineSecurity: 'No',
      OnlineBackup: 'Yes',
      DeviceProtection: 'No',
      TechSupport: 'No',
      StreamingTV: 'No',
      StreamingMovies: 'No',
      Contract: 'Month-to-month',
      PaperlessBilling: 'Yes',
      PaymentMethod: 'Electronic check',
      MonthlyCharges: 29.85,
      TotalCharges: 350.5
    })
    setResponse(null)
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResponse(null)

    const clientErrors = validateForm()
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors)
      // focus first invalid field
      const first = Object.keys(clientErrors)[0]
      const el = document.getElementById(first)
      if (el && typeof el.focus === 'function') el.focus()
      setLoading(false)
      return
    }

    const payload = {
      ...form,
      SeniorCitizen: Number(form.SeniorCitizen),
      tenure: Number(form.tenure),
      MonthlyCharges: Number(form.MonthlyCharges),
      TotalCharges: Number(form.TotalCharges)
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/predict/churn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        // map server validation errors to fields if present
        if (data && Array.isArray(data.detail)) {
          const serverErrors = {}
          data.detail.forEach(d => {
            const loc = d.loc || []
            const field = loc.length ? loc[loc.length - 1] : null
            if (field) serverErrors[field] = d.msg
          })
          if (Object.keys(serverErrors).length) setErrors(serverErrors)
        }
        setError(data)
      } else {
        setResponse(data)
        setErrors({})
      }
    } catch (err) {
      setError({ message: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <h1>Customer Churn Predictor</h1>
        <p className="subtitle">Fill customer details and get an instant churn probability.</p>
      </header>

      <main className="container">
        <form className="form" onSubmit={handleSubmit}>
          <div className="grid">
            <Field label="Gender" name="gender" error={errors.gender}>
              <select id="gender" name="gender" className={errors.gender ? 'invalid' : ''} aria-invalid={!!errors.gender} aria-describedby={errors.gender ? 'err-gender' : undefined} value={form.gender} onChange={e => setField('gender', e.target.value)}>
                <option value="">Select gender</option>
                {OPTIONS.gender.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Senior Citizen" name="SeniorCitizen" error={errors.SeniorCitizen}>
              <select id="SeniorCitizen" name="SeniorCitizen" className={errors.SeniorCitizen ? 'invalid' : ''} aria-invalid={!!errors.SeniorCitizen} aria-describedby={errors.SeniorCitizen ? 'err-SeniorCitizen' : undefined} value={form.SeniorCitizen} onChange={e => setField('SeniorCitizen', e.target.value)}>
                <option value="">Select</option>
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </Field>

            <Field label="Partner" name="Partner" error={errors.Partner}>
              <select id="Partner" name="Partner" className={errors.Partner ? 'invalid' : ''} aria-invalid={!!errors.Partner} aria-describedby={errors.Partner ? 'err-Partner' : undefined} value={form.Partner} onChange={e => setField('Partner', e.target.value)}>
                <option value="">Select</option>
                {OPTIONS.yesno.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Dependents" name="Dependents" error={errors.Dependents}>
              <select id="Dependents" name="Dependents" className={errors.Dependents ? 'invalid' : ''} aria-invalid={!!errors.Dependents} aria-describedby={errors.Dependents ? 'err-Dependents' : undefined} value={form.Dependents} onChange={e => setField('Dependents', e.target.value)}>
                <option value="">Select</option>
                {OPTIONS.yesno.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Tenure (months)" name="tenure" error={errors.tenure}>
              <input id="tenure" name="tenure" className={errors.tenure ? 'invalid' : ''} aria-invalid={!!errors.tenure} aria-describedby={errors.tenure ? 'err-tenure' : undefined} type="number" min="0" value={form.tenure} onChange={e => setField('tenure', e.target.value)} />
            </Field>

            <Field label="Phone Service" name="PhoneService" error={errors.PhoneService}>
              <select id="PhoneService" name="PhoneService" className={errors.PhoneService ? 'invalid' : ''} aria-invalid={!!errors.PhoneService} aria-describedby={errors.PhoneService ? 'err-PhoneService' : undefined} value={form.PhoneService} onChange={e => setField('PhoneService', e.target.value)}>
                <option value="">Select</option>
                {OPTIONS.yesno.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Multiple Lines" name="MultipleLines" error={errors.MultipleLines}>
              <select id="MultipleLines" name="MultipleLines" className={errors.MultipleLines ? 'invalid' : ''} aria-invalid={!!errors.MultipleLines} aria-describedby={errors.MultipleLines ? 'err-MultipleLines' : undefined} value={form.MultipleLines} onChange={e => setField('MultipleLines', e.target.value)}>
                <option value="">Select</option>
                {OPTIONS.multipleLines.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Internet Service" name="InternetService" error={errors.InternetService}>
              <select id="InternetService" name="InternetService" className={errors.InternetService ? 'invalid' : ''} aria-invalid={!!errors.InternetService} aria-describedby={errors.InternetService ? 'err-InternetService' : undefined} value={form.InternetService} onChange={e => setField('InternetService', e.target.value)}>
                <option value="">Select</option>
                {OPTIONS.internet.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Online Security" name="OnlineSecurity" error={errors.OnlineSecurity}>
              <select id="OnlineSecurity" name="OnlineSecurity" className={errors.OnlineSecurity ? 'invalid' : ''} aria-invalid={!!errors.OnlineSecurity} aria-describedby={errors.OnlineSecurity ? 'err-OnlineSecurity' : undefined} value={form.OnlineSecurity} onChange={e => setField('OnlineSecurity', e.target.value)}>
                <option value="">Select</option>
                {OPTIONS.onoff.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Online Backup" name="OnlineBackup" error={errors.OnlineBackup}>
              <select id="OnlineBackup" name="OnlineBackup" className={errors.OnlineBackup ? 'invalid' : ''} aria-invalid={!!errors.OnlineBackup} aria-describedby={errors.OnlineBackup ? 'err-OnlineBackup' : undefined} value={form.OnlineBackup} onChange={e => setField('OnlineBackup', e.target.value)}>
                <option value="">Select</option>
                {OPTIONS.onoff.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Device Protection" name="DeviceProtection" error={errors.DeviceProtection}>
              <select id="DeviceProtection" name="DeviceProtection" className={errors.DeviceProtection ? 'invalid' : ''} aria-invalid={!!errors.DeviceProtection} aria-describedby={errors.DeviceProtection ? 'err-DeviceProtection' : undefined} value={form.DeviceProtection} onChange={e => setField('DeviceProtection', e.target.value)}>
                <option value="">Select</option>
                {OPTIONS.onoff.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Tech Support" name="TechSupport" error={errors.TechSupport}>
              <select id="TechSupport" name="TechSupport" className={errors.TechSupport ? 'invalid' : ''} aria-invalid={!!errors.TechSupport} aria-describedby={errors.TechSupport ? 'err-TechSupport' : undefined} value={form.TechSupport} onChange={e => setField('TechSupport', e.target.value)}>
                <option value="">Select</option>
                {OPTIONS.onoff.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Streaming TV" name="StreamingTV" error={errors.StreamingTV}>
              <select id="StreamingTV" name="StreamingTV" className={errors.StreamingTV ? 'invalid' : ''} aria-invalid={!!errors.StreamingTV} aria-describedby={errors.StreamingTV ? 'err-StreamingTV' : undefined} value={form.StreamingTV} onChange={e => setField('StreamingTV', e.target.value)}>
                <option value="">Select</option>
                {OPTIONS.onoff.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Streaming Movies" name="StreamingMovies" error={errors.StreamingMovies}>
              <select id="StreamingMovies" name="StreamingMovies" className={errors.StreamingMovies ? 'invalid' : ''} aria-invalid={!!errors.StreamingMovies} aria-describedby={errors.StreamingMovies ? 'err-StreamingMovies' : undefined} value={form.StreamingMovies} onChange={e => setField('StreamingMovies', e.target.value)}>
                <option value="">Select</option>
                {OPTIONS.onoff.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Contract" name="Contract" error={errors.Contract}>
              <select id="Contract" name="Contract" className={errors.Contract ? 'invalid' : ''} aria-invalid={!!errors.Contract} aria-describedby={errors.Contract ? 'err-Contract' : undefined} value={form.Contract} onChange={e => setField('Contract', e.target.value)}>
                <option value="">Select</option>
                {OPTIONS.contract.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Paperless Billing" name="PaperlessBilling" error={errors.PaperlessBilling}>
              <select id="PaperlessBilling" name="PaperlessBilling" className={errors.PaperlessBilling ? 'invalid' : ''} aria-invalid={!!errors.PaperlessBilling} aria-describedby={errors.PaperlessBilling ? 'err-PaperlessBilling' : undefined} value={form.PaperlessBilling} onChange={e => setField('PaperlessBilling', e.target.value)}>
                <option value="">Select</option>
                {OPTIONS.yesno.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Payment Method" name="PaymentMethod" error={errors.PaymentMethod}>
              <select id="PaymentMethod" name="PaymentMethod" className={errors.PaymentMethod ? 'invalid' : ''} aria-invalid={!!errors.PaymentMethod} aria-describedby={errors.PaymentMethod ? 'err-PaymentMethod' : undefined} value={form.PaymentMethod} onChange={e => setField('PaymentMethod', e.target.value)}>
                <option value="">Select</option>
                {OPTIONS.payment.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>

            <Field label="Monthly Charges" name="MonthlyCharges" error={errors.MonthlyCharges}>
              <input id="MonthlyCharges" name="MonthlyCharges" className={errors.MonthlyCharges ? 'invalid' : ''} aria-invalid={!!errors.MonthlyCharges} aria-describedby={errors.MonthlyCharges ? 'err-MonthlyCharges' : undefined} type="number" step="0.01" value={form.MonthlyCharges} onChange={e => setField('MonthlyCharges', e.target.value)} />
            </Field>

            <Field label="Total Charges" name="TotalCharges" error={errors.TotalCharges}>
              <input id="TotalCharges" name="TotalCharges" className={errors.TotalCharges ? 'invalid' : ''} aria-invalid={!!errors.TotalCharges} aria-describedby={errors.TotalCharges ? 'err-TotalCharges' : undefined} type="number" step="0.01" value={form.TotalCharges} onChange={e => setField('TotalCharges', e.target.value)} />
            </Field>
          </div>

          <div className="actions">
            <button type="button" className="ghost" onClick={fillExample}>Fill example</button>
            <button type="submit" className="primary" disabled={loading}>{loading ? 'Predicting...' : 'Predict Churn'}</button>
          </div>
        </form>

        <aside className="result">
          {!response && !error && (
            <div className="hint">Prediction will appear here after submitting the form.</div>
          )}

          {error && (
            <div className="error">
          <h3>Validation / Error</h3>
            <pre style={{ color: '#b00020' }}>{JSON.stringify(error, null, 2)}</pre>
            </div>
          )}

          {response && (
            <div className="card">
              <h3>Prediction</h3>
              <div className="prob">
                <div className="bar">
                  <div className="fill" style={{ width: `${Math.round(response.probability * 100)}%` }} />
                </div>
                <div className="percent">{Math.round(response.probability * 100)}%</div>
              </div>
              <div className={`badge ${response.result ? 'churn' : 'noc'} `}>
                {response.result ? 'Likely to churn' : 'Not likely to churn'}
              </div>
            </div>
          )}
        </aside>
      </main>

      <style jsx>{`
        .page { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding: 24px; }
        .hero { text-align: center; margin-bottom: 18px }
        .hero h1 { margin: 0; font-size: 28px }
        .subtitle { color: #666; margin-top: 6px }
        .container { display: grid; grid-template-columns: 1fr 360px; gap: 20px; max-width: 1100px; margin: 0 auto }
        .form { background: #fff; padding: 18px; border-radius: 10px; box-shadow: 0 4px 18px rgba(21,31,60,0.06) }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px }
        .field { display:flex; flex-direction: column }
        .label { font-size: 13px; color: #333; margin-bottom: 6px }
        input, select { padding: 8px 10px; border: 1px solid #d9e1ec; border-radius: 6px; font-size: 14px }
  .actions { display:flex; justify-content: space-between; margin-top: 16px }
  .invalid { border-color: #b00020 !important; box-shadow: 0 0 0 4px rgba(176,0,32,0.06); }
  .fieldError { color: #b00020 !important; font-size: 12px; margin-top: 6px; font-weight: 600 }
  .error pre { color: #b00020; }
        .primary { background: #0066ff; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor:pointer }
        .primary:disabled { opacity: 0.6 }
        .ghost { background: transparent; border: 1px solid #d0d7e6; padding: 8px 12px; border-radius: 8px; cursor: pointer }
        .result { height: 100%; }
        .hint { color:#666; padding: 12px; background:#fbfbfd; border-radius:8px }
        .card { background: linear-gradient(180deg,#fff,#fbfbff); padding:12px; border-radius:10px; box-shadow:0 6px 20px rgba(18,22,45,0.04) }
        .prob { display:flex; align-items:center; gap:12px }
        .bar { flex:1; background:#e6eefc; height:12px; border-radius:8px; overflow:hidden }
        .fill { height:100%; background:linear-gradient(90deg,#ff6b6b,#ffb86b) }
        .percent { width:56px; text-align:right; font-weight:600 }
        .badge { margin-top:12px; display:inline-block; padding:8px 12px; border-radius:999px; font-weight:600 }
        .badge.churn { background:#ffecec; color:#b00020 }
        .badge.noc { background:#ecfff1; color:#007a3d }
        .raw { margin-top:10px; background:#0f1724; color:#dbeafe; padding:8px; border-radius:6px; font-size:12px }
        .error pre { white-space: pre-wrap }
        @media (max-width: 900px) { .container { grid-template-columns: 1fr; } .grid { grid-template-columns: 1fr } }
      `}</style>
    </div>
  )
}
