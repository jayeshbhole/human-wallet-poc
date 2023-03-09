import PhoneInput from '../components/PhoneInput';

const PhoneLogin = () => {
  return (
    <div className="px-4">
      {/* back button */}
      <div className="flex items-center justify-start w-full h-12">back</div>
      {/* step title */}
      <h1 className="onboarding --step-heading">
        What's your <br />
        <span className="emphasis">Phone Number?</span>
      </h1>
      {/* step description */}
      <p className="onboarding --step-description">Enter the phone number for your account.</p>

      {/* phone number input */}
      {/* <div className="flex justify-between">
        <div>IN +91</div>
        <input
          type="tel"
          className="onboarding --phone-input"
          placeholder="0000 000 000"
        />
      </div> */}

      <PhoneInput />
    </div>
  );
};

export default PhoneLogin;
