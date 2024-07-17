import {notFound} from 'next/navigation';


const ComponentsPage = () => {
  if (process.env.K_ENVIRONMENT === 'Local')
    notFound();

  return (
    <div>
      Components, environment = {process.env.K_ENVIRONMENT}
    </div>
  );
};


export default ComponentsPage;
