
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Scanner from './pages/Scanner'
import History from './pages/History'
import Learning from './pages/Learning'
import Analyze from './pages/Analyze'
import Login from './pages/login'
import Signup from './pages/Signup'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/home' element ={<Home/>}/>
        <Route path='/scanner' element ={<Scanner/>}/>
        <Route path='/history' element ={<History/>}/>
        <Route path='/learning' element ={<Learning/>}/>
        <Route path='/analyze' element ={<Analyze/>}/>
      </Routes>
    </>
  )
}

export default App