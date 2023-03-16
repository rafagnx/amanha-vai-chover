
/**
 * handle with ours
 * @returns hour formated
 */

export const isHour = () => {
    const actualDate = new Date();
    const hour = actualDate.getHours();
    const minute = actualDate.getMinutes();
    const hourFormated = hour < 10 ? `0${hour}` : hour;
    const minutFormated = minute < 10 ? `0${minute}` : minute;

    return `${hourFormated}:${minutFormated}`;
}



   
