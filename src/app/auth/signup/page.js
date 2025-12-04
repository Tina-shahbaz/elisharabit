'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import OtpVerificationForm from '@/app/components/auth/OtpVerificationForm';

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { countryCode: 'US', fullAddress: '' },
  });

  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState('signup');
  const [userEmail, setUserEmail] = useState('');

  const countries = [
    { name: 'United States', code: 'US', dialCode: '+1', min: 10, max: 10 },
    { name: 'United Kingdom', code: 'GB', dialCode: '+44', min: 10, max: 11 },
    { name: 'India', code: 'IN', dialCode: '+91', min: 10, max: 10 },
    { name: 'Pakistan', code: 'PK', dialCode: '+92', min: 10, max: 11 },
    { name: 'Canada', code: 'CA', dialCode: '+1', min: 10, max: 10 },
    { name: 'Australia', code: 'AU', dialCode: '+61', min: 9, max: 9 },
    { name: 'Germany', code: 'DE', dialCode: '+49', min: 10, max: 11 },
    { name: 'France', code: 'FR', dialCode: '+33', min: 9, max: 10 },
    { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', min: 9, max: 9 },
    { name: 'UAE', code: 'AE', dialCode: '+971', min: 9, max: 9 },
  ];

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Location state for coordinates
  const [coordinates, setCoordinates] = useState([0, 0]);

  useEffect(() => {
    register('countryCode', { required: true });
    setValue('countryCode', 'US');
  }, [register, setValue]);

  const countryCode = watch('countryCode') || 'US';
  const selectedCountry = countries.find((c) => c.code === countryCode) || countries[0];

  useEffect(() => {
    function onDocClick(e) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const onPhoneInput = (e) => {
    const cleaned = (e.target.value || '').replace(/\D/g, '');
    e.target.value = cleaned;
  };

  // Location change handler
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setValue('fullAddress', value, { shouldValidate: true, shouldDirty: true });
    setValue('city', value.split(',')[0] || '', { shouldValidate: true });
    setCoordinates([74.3587, 31.5204]); // dummy coordinates, replace with real API if needed
  };

  const onSubmit = async (data) => {
    setApiError('');
    setSubmitting(true);

    data.location = {
      type: 'Point',
      coordinates: coordinates,
    };

    data.fullAddress = data.fullAddress || '';
    data.city = data.city || (data.fullAddress ? data.fullAddress.split(',')[0] : '');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        const serverMsg =
          result?.error ||
          (Array.isArray(result?.issues) &&
            result.issues.map((i) => `${i.field}: ${i.message}`).join(' | ')) ||
          'Signup failed';
        setApiError(serverMsg);
        return;
      }

      setUserEmail(data.email);
      setStep('verify');
    } catch (err) {
      console.error('Signup error:', err);
      setApiError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="flex flex-col items-center gap-4 w-full">
        <h2 className="text-lg font-semibold">Verify Your Email</h2>
        <p className="text-sm text-gray-600">
          We sent an OTP to <span className="font-medium">{userEmail}</span>
        </p>
        <OtpVerificationForm email={userEmail} />
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 min-w-[80%] pt-5">
        <input
          {...register('firstName', { required: "Can't be blank." })}
          className="border rounded p-2 w-full"
          placeholder="First Name"
          type="text"
        />
        {errors.firstName && <p className="text-red-500 text-md">{errors.firstName.message}</p>}

        <input
          {...register('lastName', { required: "Can't be blank." })}
          className="border rounded p-2 w-full"
          placeholder="Last Name"
          type="text"
        />
        {errors.lastName && <p className="text-red-500 text-md">{errors.lastName.message}</p>}

        <input
          {...register('email', { required: "Can't be blank." })}
          className="border rounded p-2 w-full"
          placeholder="Email"
          type="email"
        />
        {errors.email && <p className="text-red-500 text-md">{errors.email.message}</p>}

        {/* Phone */}
        <div className="flex gap-3 items-stretch">
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((s) => !s)}
              className="flex items-center gap-2 border rounded px-3 py-2 min-w-[110px] bg-white hover:shadow-sm cursor-pointer"
              aria-expanded={open}
            >
              <img
                src={`https://flagsapi.com/${selectedCountry.code}/flat/32.png`}
                alt={`${selectedCountry.name} flag`}
                className="w-6 h-4 object-cover"
              />
              <span className="font-medium">{selectedCountry.dialCode}</span>
            </button>

            {open && (
              <ul className="absolute left-0 mt-2 w-60 max-h-56 overflow-auto rounded bg-white border shadow-lg z-50">
                {countries.map((c) => (
                  <li
                    key={c.code}
                    onClick={() => {
                      setValue('countryCode', c.code, { shouldDirty: true, shouldValidate: true });
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <img
                      src={`https://flagsapi.com/${c.code}/flat/32.png`}
                      alt={`${c.name} flag`}
                      className="w-6 h-4 object-cover"
                    />
                    <span className="flex-1 text-sm">{c.name}</span>
                    <span className="text-sm text-gray-600">{c.dialCode}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex-1">
            <input
              {...register('phone', {
                required: "Can't be blank.",
                setValueAs: (v) => (v || '').replace(/\D/g, ''),
                pattern: { value: /^\d+$/, message: 'Digits only' },
                validate: (val) => {
                  const c = countries.find((x) => x.code === countryCode) || countries[0];
                  const len = (val || '').length;
                  return len >= c.min && len <= c.max ? true : 'Phone number is not valid.';
                },
              })}
              onInput={onPhoneInput}
              inputMode="numeric"
              className="border rounded p-2 w-full"
              placeholder="Phone Number"
              type="tel"
            />
          </div>
        </div>
        {errors.phone && <p className="text-red-500 text-md">{errors.phone.message}</p>}

        <input
          {...register('password', {
            required: "Password can't be blank.",
            minLength: { value: 8, message: 'Password must be at least 8 characters long' },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
              message: 'Password must be strong.',
            },
          })}
          className="border rounded p-2 w-full"
          placeholder="Password"
          type="password"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <input
          {...register('confirmPassword', {
            required: "Can't be blank.",
            validate: (v) => v === watch('password') || 'Passwords do not match',
          })}
          className="border rounded p-2 w-full"
          placeholder="Confirm Password"
          type="password"
        />
        {errors.confirmPassword && <p className="text-red-500 text-md">{errors.confirmPassword.message}</p>}

        <input
          {...register('zipCode', {
            required: "Can't be blank.",
            minLength: { value: 4, message: 'Please enter a valid postal code' },
            pattern: { value: /^[0-9]+$/, message: 'Zip code must contain only numbers' },
          })}
          className="border rounded p-2 w-full"
          placeholder="Zip Code"
          type="text"
        />
        {errors.zipCode && <p className="text-red-500 text-md">{errors.zipCode.message}</p>}

        {/* Full Address */}
        <input
          {...register('fullAddress', { required: "Can't be blank." })}
          value={watch('fullAddress') || ''}
          onChange={handleLocationChange}
          className="border rounded p-2 w-full"
          placeholder="City / Location"
          type="text"
        />
        {errors.fullAddress && <p className="text-red-500 text-md">{errors.fullAddress.message}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-black text-white py-2 cursor-pointer transition disabled:opacity-60"
        >
          {submitting ? 'Creating...' : 'Sign Up'}
        </button>

        {apiError && <p className="text-red-500 text-sm mt-2">{apiError}</p>}
      </form>

      <p className="text-xs px-3 text-gray-600 mt-3 text-center">
        By clicking below and creating an account, I agree to GoZipply{' '}
        <Link href="#" className="underline cursor-pointer">Terms of Service</Link> and{' '}
        <Link href="#" className="underline cursor-pointer">Privacy Policy</Link>.
      </p>
    </>
  );
}
