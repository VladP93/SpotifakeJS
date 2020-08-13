import { toast } from "react-toastify";

export default function Errors(err) {
  switch (err.code) {
    case "auth/wrong-password":
      toast.warning("Contraseña incorrecta");
      break;
    case "auth/email-already-in-use":
      toast.warning("Ese email ya está en uso");
      break;
    default:
      toast.warning("Error: " + JSON.stringify(err));
      break;
  }
}
