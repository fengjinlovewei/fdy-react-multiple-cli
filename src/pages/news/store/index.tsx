import React, { useReducer, FC, ReactNode } from 'react';

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

export const GlobalContext = React.createContext<GlobalContextType>({} as any);
export const GlobalProvider = GlobalContext.Provider;

const LEVEL = Symbol();
const NAME = Symbol();

interface actionType {
  type: typeof LEVEL | typeof NAME;
  payload: any;
}

const Reducer = (state: initDataType, action: actionType): initDataType => {
  switch (action.type) {
    case LEVEL:
      return { ...state, level: action.payload };
    case NAME:
      return { ...state, name: action.payload };
    default:
      return state;
  }
};

const Store: FC<{ children: ReactNode }> = (props) => {
  const { children } = props;
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

  return (
    <GlobalProvider value={{ ...state, ...funcs }}>{children}</GlobalProvider>
  );
};

export default Store;
