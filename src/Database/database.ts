export const askQuery = async (query: string) => {
  try{
    const result = await window.api.askQuery(query);
    return result;
  }
  catch(e){
    console.error(e)
    throw new Error(e)
  }
  
}
export const updateQuery = (query: string) => {
  try {
    window.api.updateQuery(query);
  } catch(e){
    console.error(e)
    throw new Error(e)
  }
}