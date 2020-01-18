var Web = function()
{
    const axiosConfig = {
        headers: {
            'Authorization': 'Basic am9yZ2U6d29yZGNhbXA=',
            'Content-Type': 'application/json'
        }
    };

    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

    let synth        = window.speechSynthesis;
    let recognition  = null;
    let speechToText = null;
    let speak        = null;
    let id           = null;
    let titulo       = '';
    let texto        = '';
    let voiceS       = 0; //15; //0;

    let fw  = {

        init: function() {
            if ('SpeechRecognition' in window)
            {
                recognition                 = new window.SpeechRecognition();
                recognition.interimResults  = false;
                recognition.maxAlternatives = 1;
                recognition.continuous      = false;
                recognition.lang            = 'es-es';
            }
            else
            {
              console.log("no tengo reconocimiento");
            }
        },

        reconocer: function(callback) {
            recognition.onresult = function(event) {
                speechToText = fw.transcripcion(event);

                if(speechToText.startsWith('lorexa'))
                {
                    speechToText = speechToText.substring(0, 5);
                }

                speechToText = speechToText.trim();

                if(speechToText == 'buscar un producto')
                    fw.buscarArticulo();
                else
                    callback(event);
            };
        },

        transcripcion: function(event) {
            resultados = event.results;
            console.log(resultados);
            return resultados[resultados.length-1][0].transcript;
        },

        escuchar: function() {
            if(recognition)
            {
                recognition.start();
                fw.reconocer(function(event) {
                    fw.hablar(speechToText);
                })
            }
            else
                console.log("no puedo escuchar");
        },

        hablar: function(text, callback) {
            var msg      = new SpeechSynthesisUtterance();
            var voices   = window.speechSynthesis.getVoices();
            msg.voice    = voices[voiceS];
            msg.voiceURI = 'native';
            msg.volume   = 1; // 0 to 1
            //msg.rate   = 1; // 0.1 to 10
            //msg.pitch  = 2; //0 to 2
            msg.text     = text;
            msg.lang     = 'es-ES';

            msg.onend = function(event) {
                console.log('Finished in ' + event.elapsedTime + ' seconds.');
                if (callback) {
                    callback();
                }
            };

            msg.onerror = function (event) {
                console.log(event);
                // if (callback) {
                //     callback(e);
                // }
            };

            speechSynthesis.speak(msg);
        },

        buscarArticulo: function() {
            fw.hablar('Dime el artículo a buscar:', function() {
                recognition.start();
                fw.reconocer(function(event) {
                    texto = fw.transcripcion(event);
                    console.log(texto);

                    fw.hablar('Estoy buscando...'+texto);

                    setTimeout(function() {
                        document.location.href = '/?s='+texto+'&post_type=product';
                    }, 3000);
                })
            });
        }

    };

    return {
        init: function () {
            fw.init();
            console.log('init complete');
        },
        handleClick: function() {
            document.getElementById("mic").addEventListener("click", function(event) {
                console.log("pulsado");
                fw.hablar('ya te puedo escuchar');
                fw.escuchar();
            });
        }
    }
}();

jQuery(document).ready(function() {
    Web.init();
    Web.handleClick();
});
