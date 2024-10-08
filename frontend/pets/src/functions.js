import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export function show_alert(title, message, icon) {
    const MySwal = withReactContent(Swal)
    MySwal.fire({
        title: title,
        text: message,
        icon: icon
    })
}

function onfocus(foco) {
    if (foco !== '') {
        document.getElementById(foco).focus()
    }
}