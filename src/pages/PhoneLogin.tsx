import PhoneInput from '../components/PhoneInput';

const PhoneLogin = () => {
  return (
    <>
      <div className="flex gap-3 flex-col">
        {/* step title */}
        <h1 className="__step-heading">
          What's your <br />
          <span className="emphasis">Phone Number?</span>
        </h1>
        {/* step description */}
        <p className="__step-description">Enter the phone number for your account.</p>
      </div>

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
    </>
  );
};

export default PhoneLogin;
