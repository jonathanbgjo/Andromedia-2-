import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import Home from "../pages/Home";

export default function MainLayout(){
    return(
        <div>
            <Navbar></Navbar>
            <Sidebar></Sidebar>
            <Home></Home>
        </div>
    )
}