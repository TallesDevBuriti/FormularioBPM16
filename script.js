$(document).ready(function () {  
    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',
        todayHighlight: true,
        autoclose: true,
        language: 'pt-BR',
        orientation: 'auto'
    });  

    $('#box-dados-proprietarios').on('click', '#btn-close-tab', function() {
        $(this).closest('#box-proprietario').remove();
    });

    $('#btn-add-new-line').click(function() {
        var customHtml = `
                <div id="box-proprietario" class="border rounded mt-3 p-3">
                    <div class="d-flex justify-content-end mb-3">
                        <button type="button" id="btn-close-tab" class="btn btn-light btn-sm">
                            <img src="./src/img/icons/close_tab.svg" alt="Icone de fechar aba">
                        </button>
                    </div>
                    <div class="row g-2">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="nomeProp" placeholder="Preencha o nome do proprietário..." required>
                            <label for="floatingInputGrid">Nome do Proprietário *</label>
                        </div>
                        <div class="col-md">
                            <div class="form-floating">
                              <input type="tel" id="contatoProp" class="form-control propPhone" maxlength="15" placeholder="(00) 00000-0000" required>
                              <label for="floatingInputGrid">Contato *</label>
                            </div>
                        </div>
                        <div class="col-md">
                            <div class="form-floating">
                              <input type="email" class="form-control" id="emailProp" placeholder="abcdefgh@email.com" required>
                              <label for="floatingInputGrid">E-mail *</label>
                            </div>
                        </div>
                    </div>
                </div>`;

        $('#box-dados-proprietarios').append(customHtml);
    });

    // Consulta API de CEP
    $("#btn-search-cep").click(function() {
        let inputTextCep = $(".box-search-cep").val();

        fetch(`https://viacep.com.br/ws/${inputTextCep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.uf) {
                $('.box-estado').val(data.uf);
                $('.box-municipio').val(data.localidade);

                $('.box-estado, .box-municipio').prop('disabled', true);
            } else {
                swal ( "Oops" ,  "O CEP informado é inválido. Por favor, insira um CEP válido." ,  "error" )
            }
        })
        .catch(error => {
            swal ( "Oops" ,  "Algo de errado aconteceu" ,  "error" )
        });
    });

    // Format string to contact
    $('#box-dados-proprietarios').on('input', '#contatoProp', function() {
        let value = $(this).val();
        value = value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        $(this).val(value);
    });

    // Format string to CEP (ZipCode)
    $('#cepArea').on('input', function() {
        let value = $(this).val();
        value = value.replace(/\D/g, '');
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        $(this).val(value);
    })
    
    $("#btn-add-new-attachment").on('click', function() {
        let newHtmlContent = `
                    <div id="wrap-add-file" class="box-add-file">                           
                        <div class="file-label">
                            <button type="button" id="btn-close-tab-file" class="btn btn-light btn-sm">
                                <img src="./src/img/icons/close_tab.svg" alt="Icone de fechar aba">
                            </button>
                            <div class="file-instructions">
                                <span class="form-drop-file"> Anexe </span>
                                <span class="form-or">  </span>
                                <input type="file" id="file" class="file-input"  name="file"/>
                            </div>
                            <span class="file-name" style="display: none;"></span>
                        </div>       
                    </div>`;

        $('#container-files').append(newHtmlContent);
        // document.querySelector("#container-files").appendChild(newHtmlContent);

        console.log("foi")
    });

    $('#container-files').on('click', '#btn-close-tab-file', function() {
        $(this).closest('.box-add-file').remove();


        // let test = [];

        // let blocksAnexos = document.querySelectorAll('.box-add-file #file');

        // blocksAnexos.forEach(function(inputElement) {
        //     // Verifica se há um arquivo selecionado
        //     if (inputElement.files.length > 0) {
        //         const file = inputElement.files[0]; // Pega o primeiro arquivo selecionado
        
        //         _formatFileToBase64(file).then(base64String => {
        //             test.push({base64String}) 
        //         }).catch(error => {
        //             console.error('Erro ao ler arquivo:', error);
        //         });
        //     }
        // });

        // console.log(test)
    });

    
    // function _formatFileToBase64(fileContent) {
    //     return new Promise((resolve, reject) => {
    //         var reader = new FileReader();
    
    //         reader.readAsDataURL(fileContent);
    //         reader.onload = function() {
    //             resolve(reader.result);
    //         };
    //         reader.onerror = function(error) {
    //             reject(error);
    //         };
    //     });
    // }
})
