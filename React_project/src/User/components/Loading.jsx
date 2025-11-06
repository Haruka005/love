import { useState } from "react";
import RestaurantCard from "./RestaurantCard";

function Loading(){
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
        setLoading(false); // 2秒後にローディング終了
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    
}