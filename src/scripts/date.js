/**
This function returns a list with the names of the days of the week in Portuguese,
starting from tomorrow (the day after today) until the sixth day after tomorrow.
@returns {Array} A list of strings with the names of the days of the week.
*/


export function handleWithDaysOfTheWeek() {
  const daysOfTheWeek = {
    sunday: "domingo",
    monday: "segunda - feira",
    tuesday: "terça - feira",
    wednesday: "quarta - feira",
    thursday: "quinta - feira",
    friday: "sexta - feira",
    saturday: "sábado"
  };

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate()); 

  const listDayOfTheWeek = [];

  for (let i = 1; i <= 6; i++) { 
    const nextDay = new Date(tomorrow);
   
    //define the next day
    nextDay.setDate(tomorrow.getDate() + i); 

    const dayOfWeek = daysOfTheWeek[nextDay.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()]; // pega o nome do dia da semana em português
    
    if (i === 1) {
      listDayOfTheWeek.push("amanhã");
    } else {
      listDayOfTheWeek.push(dayOfWeek);
    }
  }

  return listDayOfTheWeek;
}
