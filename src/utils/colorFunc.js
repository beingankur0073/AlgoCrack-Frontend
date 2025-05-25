export const getColor=(difficulty)=>{
    switch (difficulty) {
        case "Easy":
            return "text-green-400";
        case "Medium":
            return "text-yellow-400";
        case "Hard":
            return "text-red-400";
        default:
            return "";
    }
}