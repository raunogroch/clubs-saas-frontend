import { RegisterForm } from "../components/RegisterForm";
import { GuestRoute } from "../components/ProtectedRoute";

/**
 * Página de Registro
 */

export const RegisterPage = () => {
  return (
    <GuestRoute>
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-sm">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h1 className="h3 font-weight-bold mb-2">Create Account</h1>
                    <p className="text-muted">
                      Join the Clubs Platform community
                    </p>
                  </div>

                  <RegisterForm />

                  <hr className="my-4" />

                  <div className="text-center">
                    <p className="small text-muted">
                      Your data is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestRoute>
  );
};
