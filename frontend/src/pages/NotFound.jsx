import { Link } from "react-router-dom";
import Layout from '../components/Layout'

const NotFound = () => {
    return (
        <Layout>
        <div className=" flex justify-center items-center flex-col gap-3 bg-gradient-to-bl from-slate-300 to-slate-900  min-h-screen">
         <div className=" flex items-center justify-center flex-col bg-white/10 p-2 pb-5 w-full md:w-[500px] ">
         <h1 className="text-white text-[80px] text-center font-bold">404</h1>
            <h1 className="text-white text-[50px]  "> Page Not Found</h1>
            <Link to={'/'} className="rounded text-white bg-blue-500 hover:bg-blue-800 p-3 text-[20px]">Go Home</Link>
         </div>
        </div>
        </Layout>
    );
}

export default NotFound;
