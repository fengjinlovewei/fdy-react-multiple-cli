import { useTranslation } from 'react-i18next';

export function Ds(props: any) {
  const { t } = useTranslation();
  return (
    <div>
      {props.name}
      <div>{t('book.title')}</div>
      <div>{t('book.content')}</div>asdasd
      {<div></div>}
    </div>
  );
}
