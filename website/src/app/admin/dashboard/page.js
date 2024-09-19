// Components
import SignOutButton from '@/app/admin/sign-out-button';
import chalk from 'chalk';


const DashboardPage = () => {
  console.log(chalk.redBright.bgBlue.bold('Dashboard Page!'));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <div>Dashboard</div>
      {/**/}
      <div style={{ width: '300px', minHeight: '100px', background: 'yellow', color: 'black', display: 'grid', placeItems: 'center', margin: '10px 20px' }}>
        Force Scrollbar
      </div>
      <div style={{ width: '300px', minHeight: '100px', background: 'orange', color: 'black', display: 'grid', placeItems: 'center', margin: '10px 20px' }}>
        Force Scrollbar
      </div>
      <div style={{ width: '300px', minHeight: '100px', background: 'yellow', color: 'black', display: 'grid', placeItems: 'center', margin: '10px 20px' }}>
        Force Scrollbar
      </div>
      <div style={{ width: '300px', minHeight: '100px', background: 'orange', color: 'black', display: 'grid', placeItems: 'center', margin: '10px 20px' }}>
        Force Scrollbar
      </div>
      <div style={{ width: '300px', minHeight: '100px', background: 'yellow', color: 'black', display: 'grid', placeItems: 'center', margin: '10px 20px' }}>
        Force Scrollbar
      </div>
      {/**/}
      <div style={{ width: '300px', minHeight: '100px', background: 'orange', color: 'black', display: 'grid', placeItems: 'center', margin: '10px 20px' }}>
        Force Scrollbar
      </div>
      <div style={{ width: '300px', minHeight: '100px', background: 'yellow', color: 'black', display: 'grid', placeItems: 'center', margin: '10px 20px' }}>
        Force Scrollbar
      </div>
      <div style={{ width: '300px', minHeight: '100px', background: 'orange', color: 'black', display: 'grid', placeItems: 'center', margin: '10px 20px' }}>
        Force Scrollbar
      </div>
      <div style={{ width: '300px', minHeight: '100px', background: 'yellow', color: 'black', display: 'grid', placeItems: 'center', margin: '10px 20px' }}>
        Force Scrollbar
      </div>
      <div style={{ width: '300px', minHeight: '100px', background: 'orange', color: 'black', display: 'grid', placeItems: 'center', margin: '10px 20px' }}>
        Force Scrollbar
      </div>
      <SignOutButton />
    </div>
  );
};


export default DashboardPage;
