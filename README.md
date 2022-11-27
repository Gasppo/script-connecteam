Pasos
=====

El documento actual detallará los pasos para realizar la carga de horas mensuales en connecteam con el script que puede encontrar [aqui](https://github.com/Gasppo/script-connecteam/blob/master/script-connecteam.js).

Ante cualquier consulta pueden mandarme un mensaje a **gaspar.garciabarnetche@adilafinpay.com**

* * *

**Paso 1:**  Abrir Navegador

* * *

**Paso 2:** Ingresar a [_app.connecteam.com_](https://app.connecteam.com/)

* * *

**Paso 3:** Clickear en el selector de país y elegir Argentina

![Step 3 screenshot.](archivos_tutorial/image001.jpg) 

* * *

**Paso 4:** Ingresar su número de teléfono y apretar ‘Verify’

![Step 4 screenshot.](archivos_tutorial/image002.jpg) 

* * *

**Paso 5:** Ingresar codigo de verificación recibido por SMS

![Step 5 screenshot.](archivos_tutorial/image003.jpg) 

* * *

**Paso 6:** Usted debería encontrarse con el panel de inicio de Connecteam

![Step 6 screenshot.](archivos_tutorial/image004.jpg) 


* * *

**Paso 7:** Hacer click derecho luego “Inspect/Inspeccionar”

![Step 6 screenshot.](archivos_tutorial/image005.jpg) 

* * *

**Paso 8:** Hacer click en la pestaña de ‘Console/Consola’

![Step 14 screenshot.](archivos_tutorial/image006.jpg) 

* * *

**Paso 9:** Copiar el contenido del script (CTRL + C)

![Step 17 screenshot.](archivos_tutorial/image007.jpg)

* * *

**Paso 10:** Pegar el contenido del script en la consola (CTRL+V) y luego dar enter para cargar el script en el navegador.

![Step 20 screenshot.](archivos_tutorial/image008.jpg) 

* * *

**Paso 11:** Ejecutar el script generateMontlyRequests con los siguientes 3 parametros:

- Project Name: Nombre del Proyecto al que se le asignaran las horas

- Year: Año de la carga

- Month: Mes de la carga (Numérico)

- Days Excluded: Arreglo de fechas que no se desean cargar, ejemplo como no quise cargar el feriado del 21 de noviembre incluí \[21\]. Los sábados y domingos se encuentran automáticamente excluidos. Este parámetro es opcional, si no se lo incluye solo se excluirán de la carga los sábados y domingos

Ejemplo de comando script
```javascript
generateMontlyRequests('Training Adila', 2022, 11, [21]) //Excluido el día 21 del mes
generateMontlyRequests('Training Adila', 2022, 11) //Si no quiero excluir dias
```

![Step 23 screenshot.](archivos_tutorial/image009.jpg)

* * *

**Paso 12:** Para verificar la carga correcta haga click en "View your requests (button)"

![Step 25 screenshot.](archivos_tutorial/image010.jpg) 

* * *

**Paso 13:** Y podrá confirmar la carga de las solicitudes

![Step 26 screenshot.](archivos_tutorial/image011.jpg) 

* * *

[Return to top of page...](#ReportTop "Return to top of page")
