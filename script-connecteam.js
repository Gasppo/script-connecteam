/**
 * Este código define una función llamada getTagID que toma dos argumentos: @param tagName y @param spiritID. 
 * La función realiza una operación POST de fetch con una URL y un cuerpo JSON que contiene un objeto payload con los valores de spiritID, defaultTimezone y objectId. 
 * Luego, convierte la respuesta del fetch en un objeto JSON y busca un objeto tag en la propiedad data.availableTags cuyo nombre sea igual al valor del argumento tagName (ignorando mayúsculas y minúsculas). 
 * Si se encuentra un objeto tag, la función devuelve su valor id. Si no se encuentra un tag o si ocurre algún error durante el proceso, la función devuelve 0.
 */
const getTagID = async (tagName, spiritID) => {
    try {

        const payload = {
            _spirit: spiritID,
            defaultTimezone: "America/Buenos_Aires",
            objectId: 2215439,
        }
        console.debug('Getting tag ID', payload)
        const response = await fetch('https://app.connecteam.com/api/UserDashboard/PunchClock/Data/', {
            "headers": { "content-type": "application/json" },
            "body": JSON.stringify(payload),
            "method": "POST",
        }).then(res => res.json())
        const tag = response.data.availableTags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase())
        if (!tag) throw new Error('Tag not found')
        return tag.id
    } catch (e) {
        console.log(e)
        return 0
    }
}


/**
 *  Este código define una función llamada createRequest que toma tres argumentos: 
 * @param {string} startDate
 * @param {string} tagID
 * @param {string} spiritID. 
 * La función comprueba si el valor del argumento tagID es igual a 0 y, si es así, lanza una excepción Error con el mensaje 'Tag not found'. 
 * Si el valor de tagID no es 0, la función crea un objeto payload con los valores de startDate, objectId, timezone, tagHierarchy, shiftAttachments, note y approvalNote, y realiza una operación POST de fetch con una URL y el cuerpo JSON que contiene el objeto payload. 
 * Si ocurre algún error durante el proceso, la función muestra un mensaje de error en la consola.
 */
const createRequest = async (startDate, tagID, spiritID) => {

    try {
        if (tagID === 0) throw new Error('Tag not found')
        const payload = {
            punchInTime: startDate,
            punchOutTime: startDate + 8 * 60 * 60,
            objectId: 2215439,
            timezone: "America/Buenos_Aires",
            tagHierarchy: [tagID],
            shiftAttachments: [{
                "id": "65cbb88e-6c3a-41b1-8822-975caed50def",
                "type": "freeText",
                "freeText": ""
            },
            {
                "id": "8c013420-5071-4803-b1b5-1920dfbc6018",
                "type": "dropdownList",
                "itemId": ""
            },
            {
                "id": "68de5de0-db73-401f-8fad-3376560e5a8f",
                "type": "number",
                "number": null
            }
            ],
            "note": "",
            "approvalNote": "",
            _spirit: spiritID
        }

        fetch('https://app.connecteam.com/api/UserDashboard/PunchClock/ShiftRequest/', {
            "headers": { "content-type": "application/json" },
            "body": JSON.stringify(payload),
            "method": "POST",
        })
    } catch (e) {
        console.log(e)
    }
}

/**
 * Este código define una función llamada getDaysOfMonth que toma dos argumentos:
 * @param {Number} year 
 * @param {Number} month 
 *
 * La función crea una matriz llamada days y un objeto date basado en la fecha proporcionada por los argumentos year y month. 
 *
 * Luego, la función itera sobre el objeto date mientras el mes sea igual al mes proporcionado por el argumento month, y si el día de la semana no es sábado ni domingo, agrega el timestamp del objeto date a la matriz days. 
 * 
 * Finalmente, la función devuelve la matriz days.
 */
const getDaysOfMonth = (year, month) => {
    const days = []
    const date = new Date(year, month - 1, 1, 9)
    while (date.getMonth() === month - 1) {
        if (date.getDay() !== 0 && date.getDay() !== 6) {
            days.push(date.getTime() / 1000)
        }
        date.setDate(date.getDate() + 1)
    }
    return days
}

/**
 * La función generateMonthlyRequests es una función asíncrona que se utiliza para generar solicitudes mensuales para un proyecto dado en un año y mes específicos. 
 * 
 * La función comienza intentando obtener las cookies del documento y verificando si la cookie llamada '_spirit' existe. 
 * 
 * Si no existe, lanza un error diciendo que no se encontró Spirit. Si existe, la función obtiene una lista de timestamps para los días del mes especificado excluyendo los días especificados en el argumento daysExcluded. 
 * 
 * Luego, intenta obtener el ID de la etiqueta para el proyecto especificado utilizando la cookie '_spirit'. 
 * 
 * Si no se encuentra la etiqueta, lanza un error. Si se encuentra, la función itera sobre los timestamps y llama a la función createRequest para crear una solicitud para cada timestamp, excluyendo aquellos que estén en la lista de timestamps excluidos. 
 * 
 * Si ocurre algún error durante el proceso, se imprime en la consola.
 * 
 * La función acepta cuatro argumentos: 
 * @async
 * @param {string} projectName - El nombre del proyecto para el que se generarán las solicitudes mensuales.
 * @param {number} year - El año para el que se generarán las solicitudes mensuales.
 * @param {number} month - El mes para el que se generarán las solicitudes mensuales.
 * @param {number[]} [daysExcluded = []] - Una matriz de días excluidos para los que no se generarán solicitudes.
 * @throws {Error} Si la cookie '_spirit' no se encuentra o si el ID de la etiqueta no se encuentra.
 * @example
 * generateMonthlyRequests('Training Adila', 2022, 11, [21]) //Excluido el día 21 del mes
 * generateMonthlyRequests ('Training Adila', 2022, 11) //Si no quiero excluir dias
 */
const generateMonthlyRequests = async (projectName, year, month, daysExcluded = []) => {
    try {
        const cookies = document.cookie.split(';').map(c => c.trim().split('=')).reduce((a, [k, v]) => ({ ...a, [k]: v }), {})
        if (!cookies['_spirit']) throw new Error('Spirit not found')

        const excludedTimestamps = daysExcluded.map(d => new Date(year, month - 1, d, 9).getTime() / 1000)
        const timestamps = getDaysOfMonth(year, month)

        const tagID = await getTagID(projectName, cookies['_spirit'])
        if (tagID === 0) throw new Error('Tag not found')

        for (const timestamp of timestamps) {
            if (!excludedTimestamps.includes(timestamp)) await createRequest(timestamp, tagID, cookies['_spirit'])
        }
    } catch (e) {
        console.log(e)
    }
}

/**
 * La función generateDailyRequests es una función asíncrona que se utiliza para generar una solicitud diaria para un proyecto dado en un año, mes y día específicos.
 * 
 * La función comienza intentando obtener las cookies del documento y verificando si la cookie llamada '_spirit' existe.
 * 
 * Si no existe, lanza un error diciendo que no se encontró Spirit. Si existe, la función obtiene un timestamp para el día especificado.
 * 
 * Luego, intenta obtener el ID de la etiqueta para el proyecto especificado utilizando la cookie '_spirit'.
 * 
 * Si no se encuentra la etiqueta, lanza un error. Si se encuentra, la función llama a la función createRequest para crear una solicitud para el timestamp especificado.
 * 
 * Si ocurre algún error durante el proceso, se imprime en la consola.
 * 
 *  La función acepta cuatro argumentos:
 * @param {string} projectName (el nombre del proyecto)
 * @param {Number} year (el año en el que se generará la solicitud)
 * @param {Number} month (el mes en el que se generará la solicitud)
 * @param {Number} day - (el día en el que se generará la solicitud) 
 * @throws {Error} Si no se encuentra la cookie '_spirit' o el TagID
*/
const generateDailyRequests = async (projectName, year, month, day) => {
    try {
        const cookies = document.cookie.split(';').map(c => c.trim().split('=')).reduce((a, [k, v]) => ({ ...a, [k]: v }), {})
        if (!cookies['_spirit']) throw new Error('Spirit not found')
        const spiritID = cookies['_spirit']

        const timestamp = new Date(year, month - 1, day, 9).getTime() / 1000

        const tagID = await getTagID(projectName, spiritID)
        if (tagID === 0) throw new Error('Tag not found')
        await createRequest(timestamp, tagID, spiritID)
    } catch (e) {
        console.log(e)
    }
}
