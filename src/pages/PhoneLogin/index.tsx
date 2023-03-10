import PhoneInput from '../../components/PhoneInput';
import './phone-login.css';

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

      <PhoneInput />

      {/* Action Button */}
    </>
  );
};

export default PhoneLogin;