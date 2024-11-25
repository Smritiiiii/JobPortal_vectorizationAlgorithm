import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Home from './components/home'
import Login from './components/auth/login'
import Signup from './components/auth/signup'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from './components/admin/AdminJobs'
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import JobSetup from './components/admin/JobSetup'

const Layout = () => (
  <>
    <Navbar />
   
  </>
);


const appRouter = createBrowserRouter([
  {
  path:'/',
  element:<Home/>
  },

  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Signup/>
  },
  {
    path:'/jobs',
    element:<Jobs/>
  },
  {
    path:'/description/:id',
    element:<JobDescription/>
  },
 

  {
    path:'/browse',
    element:<Browse/>
  },
  {
    path:'/profile',
    element:<Profile/>
  },


  {
    path:'/admin/companies',
    element:<Companies/>
  },

  {
    path:'/admin/companies/create',
    element:<CompanyCreate/>
  },

  {
    path:'/admin/companies/:id',
    element:<CompanySetup/>
  },
  {
    path:'/admin/jobs',
    element:<AdminJobs/>
  },
  {
    path:'/admin/jobs/create',
    element:<PostJob/>
  },
  {
    path:'/admin/jobs/:id/applicants',
    element:<Applicants/>
  },
  {
    path:'/admin/jobs/:id/update',
    element:<JobSetup/>
  },
])

function App() {
 

  return (
    <div>
     
    <RouterProvider router = {appRouter}/>
    </div>
  )
}

export default App
