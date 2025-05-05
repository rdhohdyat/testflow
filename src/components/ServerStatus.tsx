import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

const ServerStatus = () => {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/ping")
      .then((res) => {
        if (res.ok) {
          console.log("Server connected");
          setStatus(true);
        } else {
          console.log("Server is not responding");
          setStatus(false);
        }
      })
      .catch((err) => {
        console.log("Server dicconnected:", err);
      });
  }, []);

  return (
    <div>
      {status === true ? (
        <Badge variant="outline" className="px-3 py-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Server Connected</span>
          </div>
        </Badge>
      ) : (
        <Badge variant="outline" className="px-3 py-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Server Disconnected</span>
          </div>
        </Badge>
      )}
    </div>
  );
};

export default ServerStatus;
