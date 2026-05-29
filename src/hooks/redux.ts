import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";

/**
 * Hooks Personalizados para Redux
 *
 * Estos hooks sustituyen directamente a useDispatch y useSelector
 * pero con tipos derivados del store
 *
 * VENTAJA: No necesitas importar RootState y AppDispatch en cada componente
 *
 * USO:
 * import { useAppDispatch, useAppSelector } from "@/hooks/redux"
 *
 * En componentes:
 * const dispatch = useAppDispatch();
 * const user = useAppSelector(selectUser);
 */

/**
 * Hook para dispatch tipado
 * Reemplaza a useDispatch()
 *
 * Ejemplo:
 * const dispatch = useAppDispatch();
 * dispatch(login(credentials)); // Tipado automático
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Hook para selector tipado
 * Reemplaza a useSelector()
 *
 * Automáticamente sabe que state es RootState
 * No necesitas castear o importar tipos
 *
 * Ejemplo:
 * const user = useAppSelector(selectUser);
 * const loading = useAppSelector(selectLoginLoading);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook personalizado para manejar async thunks
 * Extrae automáticamente loading y error
 *
 * USO:
 * const { loading, error, execute } = useAsyncThunk(login);
 *
 * const handleLogin = async (credentials) => {
 *   await execute(credentials);
 * };
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAsyncThunk = <Args>(
  asyncThunk: (args: Args) => any
) => {
  const dispatch = useAppDispatch();

  const execute = async (args: Args) => {
    return dispatch(asyncThunk(args));
  };

  return {
    execute,
    dispatch,
  };
};

/**
 * Hook para manejar autenticación
 * Combina los selectores más comunes de auth
 *
 * USO:
 * const { user, isAuthenticated, loading, error } = useAuth();
 */
import { selectUser, selectIsAuthenticated, selectLoginLoading, selectLoginError } from "../features/auth/store/authSelectors";

export const useAuth = () => {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectLoginLoading);
  const error = useAppSelector(selectLoginError);

  return {
    user,
    isAuthenticated,
    loading,
    error,
  };
};
