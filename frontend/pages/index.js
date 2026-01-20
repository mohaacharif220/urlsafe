import React, { useState } from 'react';
import { Shield, Link2, MessageSquare, Image, AlertTriangle, CheckCircle, XCircle, Loader } from 'lucide-react';

const API_URL = '/api/analyze';

const PhishingDetector = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [imageFile, setImageFile] = useState(null);


  const analyzeBackend = async (content, type = 'url') => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: content, type })
      });
      return await response.json();
    } catch (error) {
      return null;
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      alert('Por favor ingresa algo para analizar');
      return;
    }
    setAnalyzing(true);
    setResult(null);
    const analysis = await analyzeBackend(inputText, activeTab === 'message' ? 'message' : 'url');
    setResult(analysis);
    setAnalyzing(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setAnalyzing(true);
      setResult(null);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target.result.split(',')[1];
        // Enviar base64 y tipo MIME al backend
        const analysis = await analyzeBackend({ base64: base64Data, mime: file.type }, 'image');
        setResult(analysis);
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRiskColor = (riesgo) => {
    switch(riesgo) {
      case 'alto': return 'bg-red-500';
      case 'medio': return 'bg-yellow-500';
      case 'bajo': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskIcon = (riesgo) => {
    switch(riesgo) {
      case 'alto': return <XCircle className="w-16 h-16" />;
      case 'medio': return <AlertTriangle className="w-16 h-16" />;
      case 'bajo': return <CheckCircle className="w-16 h-16" />;
      default: return <Shield className="w-16 h-16" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-16 h-16 text-blue-300" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">CyberSeguro</h1>
          <p className="text-blue-200">Detector de Phishing y Amenazas</p>
        </div>
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 transition ${
                activeTab === 'url' 
                  ? 'bg-blue-50 border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Link2 className="w-5 h-5" />
              <span className="font-medium">Verificar Link</span>
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 transition ${
                activeTab === 'message' 
                  ? 'bg-blue-50 border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Analizar Mensaje</span>
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 transition ${
                activeTab === 'image' 
                  ? 'bg-blue-50 border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Image className="w-5 h-5" />
              <span className="font-medium">Subir Captura</span>
            </button>
          </div>
          {/* Content */}
          <div className="p-8">
            {activeTab === 'image' ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer">
                    <Image className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium mb-2">
                      Haz clic o arrastra una imagen aquí
                    </p>
                    <p className="text-sm text-gray-500">
                      Captura de pantalla de mensajes, correos o sitios web
                    </p>
                  </label>
                </div>
                {imageFile && (
                  <p className="text-sm text-gray-600 text-center">
                    Archivo: {imageFile.name}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    activeTab === 'url'
                      ? 'Pega aquí el link sospechoso...\nEjemplo: https://paypa1-seguridad.com/verificar'
                      : 'Pega aquí el mensaje o conversación completa...\n\nEjemplo:\n"Estimado cliente, su cuenta ha sido bloqueada. Haga clic aquí para verificar sus datos..."'
                  }
                  className="w-full h-48 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-gray-700"
                />
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Analizar Ahora
                    </>
                  )}
                </button>
              </div>
            )}
            {/* Results */}
            {result && (
              <div className="mt-8 space-y-6 animate-fadeIn">
                {/* Risk Level */}
                <div className={`${getRiskColor(result.riesgo)} rounded-xl p-6 text-white text-center`}>
                  <div className="flex flex-col items-center">
                    {getRiskIcon(result.riesgo)}
                    <h3 className="text-2xl font-bold mt-4 mb-2">
                      {result.riesgo === 'alto' && '¡PELIGRO!'}
                      {result.riesgo === 'medio' && 'SOSPECHOSO'}
                      {result.riesgo === 'bajo' && 'PARECE SEGURO'}
                    </h3>
                    <p className="text-lg opacity-90">
                      {result.esPhishing ? 'Posible intento de phishing detectado' : 'No se detectaron amenazas graves'}
                    </p>
                    <div className="mt-3 text-sm opacity-75">
                      Confianza del análisis: {result.confianza}%
                    </div>
                  </div>
                </div>
                {/* Indicators */}
                {result.indicadores && result.indicadores.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      Señales detectadas:
                    </h4>
                    <ul className="space-y-2">
                      {result.indicadores.map((indicador, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{indicador}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Explanation */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-bold text-blue-900 mb-3">¿Por qué es esto?</h4>
                  <p className="text-gray-700 leading-relaxed">{result.explicacion}</p>
                </div>
                {/* Recommendation */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-bold text-green-900 mb-3">¿Qué debes hacer?</h4>
                  <p className="text-gray-700 leading-relaxed">{result.recomendacion}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-blue-200 text-sm">
            💡 Mantente seguro en línea. Nunca compartas tus contraseñas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhishingDetector;
