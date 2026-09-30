import axios from "axios";
import { useForm } from "react-hook-form";
import Field from "../common/Field";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginFrom() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const submitFrom = async (formData) => {
    //Make an API call
    // Will return Tokens and logged in user information
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/auth/login`,
        formData,
      );
      if (response.status === 200) {
        const { token, user } = response.data;
        if (token) {
          const authToken = token.token;
          const refreshToken = token.refreshToken;

          console.log(`login time authToken: ${authToken}`);
          setAuth({ user, authToken, refreshToken });
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
      setError("root.random", {
        type: "random",
        message: `User with email ${formData.email} is not found `,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitFrom)}
      className="border-b border-[#3F3F3F] pb-10 lg:pb-[60px]"
    >
      <Field label="Email" error={errors.email}>
        <input
          {...register("email", { required: "Email ID is required" })}
          className={`auth-input ${errors.email ? "border-red-500" : "border-gray-200"}`}
          type="email"
          name="email"
          id="email"
        />
      </Field>
      <Field label="Password" error={errors.password}>
        <input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Your Password must be at least 6 characters",
            },
          })}
          className={`auth-input ${errors.password ? "border-red-500" : "border-gray-200"}`}
          type="password"
          name="password"
          id="password"
        />
      </Field>
      <p>{errors?.root?.random?.message}</p>
      <button
        className="auth-input bg-green-400 font-bold text-white transition-all hover:opacity-90"
        type="submit"
      >
        Login
      </button>
    </form>
  );
}
