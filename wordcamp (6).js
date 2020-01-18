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

                if(speechToText == 'escribir un post' || speechToText == 'escribir un artículo')
                    fw.escribir();
                else if(speechToText == 'publicar' || speechToText == 'públicar')
                    fw.publicar();
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

        escribir: function()
        {
            fw.hablar('Vale, te voy a ayudar a publicar un post para que lo vean los asistentes del Meetup. ¡Vamos a ello!. Dime el titulo del post:', function() {
                recognition.start();
                fw.reconocer(function(event) {
                    titulo = fw.transcripcion(event);
                    console.log(titulo);
                    fw.hablar('Vale, has dicho: '
                     + titulo + ' . Ahora vamos a introducir contenido, dime el texto del post.', function() {
                        recognition.start();
                        fw.reconocer(function(event) {
                            texto = fw.transcripcion(event);
                            console.log(texto);
                            fw.hablar('Vale, has dicho: ' + texto + ' . Genial, he guardado el post como borrador, si quieres publicarlo, dí: publicar, en caso contrario dí: cancelar', function() {
                                recognition.start();
                                fw.reconocer();
                            });
                        });
                    });
                });
            });
        },

        publicar: function()
        {
            axios.post('/wp-json/wp/v2/posts', {
                title: titulo,
                content: texto,
                status: 'publish'
            }, axiosConfig)
            .then(function (response)
            {
                console.log(response.data);
                fw.hablar('Genial, ya he publicado el post!');
                document.location.href = '/';
            })
            .catch(function (error)
            {
                console.log(error);
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
