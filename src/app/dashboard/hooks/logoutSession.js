

export const logOut = () => {

    localStorage.removeItem('token');
    location.reload();



}