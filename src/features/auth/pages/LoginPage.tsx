import { LoginForm } from "../components/LoginForm";
import { GuestRoute } from "../components/ProtectedRoute";

/**
 * Página de Login
 *
 * Envuelta en GuestRoute para proteger que usuarios autenticados
 * accedan a esta página
 */

export const LoginPage = () => {
  return (
    <GuestRoute>
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-sm">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h1 className="h3 font-weight-bold mb-2">Sign In</h1>
                    <p className="text-muted">
                      Welcome back to Clubs Platform
                    </p>
                  </div>

                  <LoginForm />

                  <hr className="my-4" />

                  <div className="text-center">
                    <p className="small text-muted">
                      Protected by military-grade encryption
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
