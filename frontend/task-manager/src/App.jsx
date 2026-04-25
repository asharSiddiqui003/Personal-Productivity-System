import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import All from './All'
import Inbox from './Inbox'
import Next7D from './Next7D'
import Summary from './Summary'
import Edit from './Edit'
import { Routes,Route} from "react-router-dom"


function App() {
  return(
    <div>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/" element = {<All />}/>
        <Route path="/inbox" element = {<Inbox />}/>
        <Route path="/next-7d" element = {<Next7D />}/>
        <Route path="/summary" element= {<Summary />} />
        <Route path='/tasks/edit/:task_id' element= {<Edit />} />
      </Routes>
    </div>
  
  )
}

export default App
