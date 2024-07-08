this.workflowCockpit = workflowCockpit({
    init: _init,
    onSubmit: _saveData,
    onError: _rollback
});

function _init(data, info) {
    if (data && data.loadContext) {
        const { initialVariables } = data.loadContext;
        console.log("initialVariables: " + JSON.stringify(initialVariables));
    }
    
    info
        .getUserData()
        .then(function (user) {
            document.querySelector("#nomFun").setAttribute("value", user.fullname);
        })
        .then(function () {
        info.getPlatformData().then(function (platformData) {
            console.log(platformData);
        });
        info.getInfoFromProcessVariables().then(function(data) { 
            console.log(data)          
            let objectsArray = _formatStringToArrayObject(data);

            if(objectsArray.length !== 0) {
                _showViewProps(objectsArray);
            }

            _fillValuesField(data);
        })
    });
}

function _saveData(data, info) {

    let newData = {};
    let selectArea = document.querySelector("#areaEmp");
    let selectRegArea = document.querySelector("#regArea");

    // Aba 1
    newData.nomFun = document.querySelector("#nomFun").value;
    newData.area = selectArea.options[selectArea.selectedIndex].value;
    newData.dataEntrada = document.querySelector("#dataEntrada").value;


    // Aba 2
    const dadosProprietarios = [];
    let blocksProp = document.querySelectorAll('#box-proprietario');

    blocksProp.forEach(function(block) {
        const nomeProp = block.querySelector('#nomeProp').value;
        const contatoProp = block.querySelector('#contatoProp').value;
        const emailProp = block.querySelector('#emailProp').value;
        
        dadosProprietarios.push({nomeProp, contatoProp, emailProp});
    })

    newData.props = dadosProprietarios;

    // Aba 3
    newData.regArea = selectRegArea.options[selectRegArea.selectedIndex].value;
    newData.cepArea = document.querySelector("#cepArea").value;
    newData.cepEstado = document.querySelector("#cepEstado").value;
    newData.municipio = document.querySelector("#municipio").value;
    newData.areaHect = document.querySelector("#areaHectare").value;
    newData.areaMQ = document.querySelector("#areaMQ").value;

    // Aba 4
    const anexos = [];
    let blocksAnexos = document.querySelectorAll('.box-add-file #file');

    blocksAnexos.forEach(function(block) {
        if (inputElement.files.length > 0) {
            const file = inputElement.files[0];
    
            _formatFileToBase64(file).then(base64Attachment => {
                anexos.push({base64Attachment}) 
            }).catch(error => {
                console.error('Erro ao ler arquivo:', error);
            });
        }
    });

    newData.base64Attachments = anexos;
 
    console.log(newData);
    return {
      formData: newData,
    };
}

function _rollback(data, info) {
    console.log(data.error);
    if (info.isRequestNew()) {
       return removeData(data.processInstanceId);
    }
    return rollbackData(data.processInstanceId);
}

function _formatStringToArrayObject(data) {
    const regex = /\{[^}]*\}/g;
    const matches  = data[0].value.match(regex);

    const objectsArray = [];

    matches.forEach(match => {
        const cleanMatch = match.slice(1, -1);

        const properties = cleanMatch.split(', ');
        const obj = {};

        properties.forEach(property => {
            const [key, value] = property.split('=');
            obj[key.trim()] = value.trim();
        });

        objectsArray.push(obj);
    });

    return objectsArray;
}

function _showViewProps(props) { 
    $('#box-proprietario').remove();

    props.forEach(function(item) {
        var customHtml = `
        <div id="box-proprietario" class="border rounded mt-3 p-3">
            <div class="d-flex justify-content-end mb-3">
                <button type="button" id="btn-close-tab" class="btn btn-light btn-sm">
                    <img src="./src/img/icons/close_tab.svg" alt="Icone de fechar aba">
                </button>
            </div>
            <div class="row g-2">
                <div class="form-floating">
                    <input type="text" class="form-control" id="nomeProp" placeholder="Preencha o nome do proprietário..." value="${item.nomeProp}" disabled>
                    <label for="floatingInputGrid">Nome do Proprietário *</label>
                </div>
                <div class="col-md">
                    <div class="form-floating">
                      <input type="tel" id="contatoProp" class="form-control propPhone" maxlength="15" placeholder="(00) 00000-0000" value="${item.contatoProp}" disabled>
                      <label for="floatingInputGrid">Contato *</label>
                    </div>
                </div>
                <div class="col-md">
                    <div class="form-floating">
                      <input type="email" class="form-control" id="emailProp" placeholder="abcdefgh@email.com" value="${item.emailProp}" disabled>
                      <label for="floatingInputGrid">E-mail *</label>
                    </div>
                </div>
            </div>
        </div>`;

        $('#box-dados-proprietarios').append(customHtml);
    });
}

function _fillValuesField(data) {
    data.forEach(function(item) {
        switch(item.key) {
            case "areaMQ":
                var areaMQ = document.querySelector("#areaMQ");
                areaMQ.setAttribute('value', item.value)

                break;
            case "areaHect":
                var areaHect = document.querySelector("#areaHectare");
                areaHect.setAttribute('value', item.value)

                break;
            case "municipio":
                var municipio = document.querySelector("#municipio");
                municipio.setAttribute('value', item.value)

                break;
            case "cepEstado":
                var estado = document.querySelector("#cepEstado");
                estado.setAttribute('value', item.value)

                break;
            case "cepArea":
                var cep = document.querySelector("#cepArea");
                cep.setAttribute('value', item.value)

                break;
            case "regArea":
                let selectRegArea = document.querySelector("#regArea");
                selectRegArea.selectedIndex = item.value;
                
                break;
            case "dataEntrada":
                var dataEntrada = document.querySelector("#dataEntrada");
                dataEntrada.setAttribute('value', item.value)

                break;
            case "area":
                let selectArea = document.querySelector("#areaEmp");
                selectArea.selectedIndex = item.value;

                break;
            default:
                break;
        }
    });
}

function _formatFileToBase64(fileContent) {
    var reader = new FileReader();
    reader.readAsDataURL(fileContent);
    reader.onload = function() {
        return reader.result;
    }
}