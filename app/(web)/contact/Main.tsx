"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { authorizationObj, baseUrl, emailPattern } from "@/app/utils/core";
import AlertMUI from "@/app/components/mui/AlertMUI";
import { useSelector } from "react-redux";
import { BsTelephone, BsEnvelope, BsGeoAlt } from "react-icons/bs";

interface Country {
  name: {
    common: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  flags: {
    png: string;
  };
}

const ContactPage = () => {
  const currentUser = useSelector((state: any) => state?.user)

  const [c_name, set_c_name] = useState("")
  const [email, set_email] = useState("")
  const [message, set_message] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [is_loading, set_is_loading] = useState(false)
  const [error_message, set_error_message] = useState<string | null>(null)
  const [success_message, set_success_message] = useState<string | null>(null)

  useEffect(() => {
    set_c_name(`${currentUser?.first_name ? currentUser?.first_name : ""} ${currentUser?.last_name ? currentUser?.last_name : ""}`)
    set_email(`${currentUser?.email ? currentUser?.email : ""}`)
    fetchCountries()
  }, [currentUser])

  const fetchCountries = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all')
      const filteredCountries = response.data
        .filter((country: Country) => country.idd?.root && country.idd?.suffixes)
        .sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common))
      setCountries(filteredCountries)
      // Set default country (e.g., India)
      const defaultCountry = filteredCountries.find((country: Country) => country.name.common === "India")
      setSelectedCountry(defaultCountry || filteredCountries[0])
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  }

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const country = countries.find((c) => c.name.common === event.target.value)
    setSelectedCountry(country || null)
  }

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to reasonable length
    const value = event.target.value.replace(/\D/g, '').slice(0, 15)
    setPhone(value)
  }

  const getFormattedPhoneNumber = () => {
    if (!selectedCountry || !phone) return { countryCode: '', phoneNumber: '' }
    
    const countryCode = selectedCountry.idd.root + selectedCountry.idd.suffixes[0]
    // Escape special characters in the country code for regex
    const escapedCountryCode = countryCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Remove any potential country code from the phone number if user entered it
    const cleanPhone = phone.replace(new RegExp(`^${escapedCountryCode}`), '')
    
    return {
      countryCode: countryCode,
      phoneNumber: cleanPhone
    }
  }

  const handleSubmit = async () => {
    if (!c_name || c_name?.trim() === "") {
      set_error_message("Name is required")
      setTimeout(() => set_error_message(null), 3000)
      return
    }
    if (!email || email?.trim() === "") {
      set_error_message("Email is required")
      setTimeout(() => set_error_message(null), 3000)
      return
    }
    if (!emailPattern?.test(email?.toLowerCase())) {
      set_error_message("Invalid email format")
      setTimeout(() => set_error_message(null), 3000)
      return
    }
    if (!phone || phone.trim() === "") {
      set_error_message("Phone number is required")
      setTimeout(() => set_error_message(null), 3000)
      return
    }
    if (!message || message?.trim() === "") {
      set_error_message("Message is required")
      setTimeout(() => set_error_message(null), 3000)
      return
    }

    const { countryCode, phoneNumber } = getFormattedPhoneNumber()

    const formData = new FormData()
    formData.append("c_name", c_name.trim())
    formData.append("email", email.toLowerCase().trim())
    formData.append("message", message.trim())
    formData.append("country_code", countryCode)
    formData.append("contact", phoneNumber)

    try {
      set_is_loading(true)
      const resp = await axios.post(`${baseUrl}/contact_us/create`, formData, authorizationObj)
      set_is_loading(false)
      if (resp?.data?.status < 199 || resp?.data?.status > 299) {
        set_error_message(resp?.data?.message)
        setTimeout(() => {
          set_error_message(null)
        }, 3000)
        return
      }
      // Clear form on success
      set_c_name("")
      set_email("")
      set_message("")
      setPhone("")
      set_success_message("Message sent successfully")
      setTimeout(() => {
        set_success_message(null)
      }, 3000)
    } catch (error) {
      set_is_loading(false)
      set_error_message("Something went wrong, please try later")
      setTimeout(() => {
        set_error_message(null)
      }, 3000)
    }
  }

  return (
    <>
      {error_message && <AlertMUI status="error" text={error_message} />}
      {success_message && <AlertMUI status="success" text={success_message} />}
      
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-dark mb-3">Contact Us</h1>
          <p className="lead text-secondary mx-auto" style={{maxWidth: "700px"}}>
            We&apos;re here to help you! Reach out with any questions, comments, or feedback, and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="row justify-content-center g-4">
          <div className="col-12 col-md-6">
            <div className="mb-3">
              <label className="form-label">Your Name*</label>
              <input 
                type="text"
                className="form-control"
                value={c_name}
                onChange={(e) => set_c_name(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address*</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => set_email(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number*</label>
              <div className="input-group">
                <select 
                  className="form-select" 
                  style={{ maxWidth: "200px" }}
                  value={selectedCountry?.name.common || ''}
                  onChange={handleCountryChange}
                >
                  {countries.map((country) => (
                    <option 
                      key={country.name.common} 
                      value={country.name.common}
                      style={{
                        backgroundImage: `url(${country.flags.png})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: '8px center',
                        backgroundSize: '20px auto',
                        paddingLeft: '35px'
                      }}
                    >
                      {country.name.common} ({country.idd.root}{country.idd.suffixes[0]})
                    </option>
                  ))}
                </select>
                <span className="input-group-text">
                  {selectedCountry ? `${selectedCountry.idd.root}${selectedCountry.idd.suffixes[0]}` : ''}
                </span>
                <input
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter phone number without country code"
                  required
                />
              </div>
              <small className="text-muted">
                Enter number without country code. Example: If your number is +91 98765 43210, just enter 9876543210
              </small>
            </div>
            <div className="mb-3">
              <label className="form-label">Your Message*</label>
              <textarea
                className="form-control"
                rows={4}
                onChange={(e) => set_message(e.target.value)}
                required
              />
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={handleSubmit}
              disabled={is_loading}
            >
              {is_loading ? "Processing..." : "Send Message"}
            </button>
          </div>

          <div className="col-12 col-md-6">
            <div className="d-flex align-items-center mb-4">
              <div className="text-primary me-3">
                <BsTelephone size={24} />
              </div>
              <div className="text-secondary">
                +1 (123) 456-7890
              </div>
            </div>

            <div className="d-flex align-items-center mb-4">
              <div className="text-primary me-3">
                <BsEnvelope size={24} />
              </div>
              <div className="text-secondary">
                contact@kiacademy.com
              </div>
            </div>

            <div className="d-flex align-items-center mb-4">
              <div className="text-primary me-3">
                <BsGeoAlt size={24} />
              </div>
              <div className="text-secondary">
                123 KI Academy Street, New York, NY 10001
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
