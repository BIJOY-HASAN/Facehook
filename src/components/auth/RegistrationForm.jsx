import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Field from "../common/Field";

export default function RegistrationForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const submitForm = async (formData) => {
    console.log(formData);

    try {
      let response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/auth/register`,
        formData,
      );

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      setError("root.random", {
        type: "random",
        message: `Something went worng: ${error.message}`,
      });
    }
  };
  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="border-b border-[#3F3F3F] pb-10 lg:pb-[30px]"
    >
      <Field label="FirstName" error={errors.firstName}>
        <input
          {...register("firstName", { required: "firstName is required" })}
          className={`auth-input ${errors.firstName ? "border-red-500" : "border-gray-200"}`}
          type="firstName"
          name="firstName"
          id="firstName"
        />
      </Field>

      <Field label="LastName" error={errors.lastName}>
        <input
          {...register("lastName")}
          className={`auth-input ${errors.lastName ? "border-red-500" : "border-gray-200"}`}
          type="lastName"
          name="lastName"
          id="lastName"
        />
      </Field>

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
              value: 8,
              message: "Your Password must be at least 8 characters",
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
        Register
      </button>
    </form>
  );
}
