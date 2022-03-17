import {useState,useEffect} from "react";
import {obtenerListEstados} from '../fetch'

const useDataEstados =()=>{
    const [data,setData] = useState({
        content:[]
    })
    
   
    const solicitarData = async ()=>{
        
        try {
            const res = await obtenerListEstados()
            console.log(res)
            setData(res)

        } catch (error) {
         console.log(error)
      
        }
    }
    useEffect(()=>{
        solicitarData()

    },[])
    return data
}

export default useDataEstados
