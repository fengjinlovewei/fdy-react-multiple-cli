import { useReducer, FC, ReactNode, createContext } from 'react';

const initData = {
  level: 10,
  name: 'fengjin',
};

type initDataType = typeof initData;

interface funcType {
  setLevel: (level: number) => void;
  setName: (name: string) => void;
}

type GlobalContextType = initDataType & funcType;

export const GlobalContext = createContext<GlobalContextType>({} as any);
export const GlobalProvider = GlobalContext.Provider;

const LEVEL = Symbol();
const NAME = Symbol();

interface actionType {
  type: typeof LEVEL | typeof NAME;
  payload: any;
}

const Reducer = (state: initDataType, action: actionType): initDataType => {
  const { type, payload } = action;

  switch (type) {
    case LEVEL:
      return { ...state, level: payload };
    case NAME:
      return { ...state, name: payload };
    default:
      return state;
  }
};

export const useStore = () => {
  const [state, dispatch] = useReducer(Reducer, initData);

  const funcs: funcType = {
    setLevel: (level) => {
      dispatch({
        type: LEVEL,
        payload: level,
      });
    },
    setName: (name) => {
      dispatch({
        type: NAME,
        payload: name,
      });
    },
  };

  return {
    ...state,
    ...funcs,
  };
};

const StoreContent: FC<{ children: ReactNode }> = (props) => {
  const { children } = props;
  const store = useStore();

  return <GlobalProvider value={store}>{children}</GlobalProvider>;
};

export default StoreContent;
