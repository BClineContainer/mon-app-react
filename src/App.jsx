<create_file>
<path>/mnt/user-data/outputs/App.jsx</path>
<description>Creating the complete corrected App.jsx file with html2pdf properly imported</description>
<file_text>import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import {
Plus,
Trash2,
Printer,
Building2,
User,
Camera,
Globe,
Download,
Settings,
FileText,
CreditCard,
CheckCircle2
} from 'lucide-react';
const App = () => {
const [docType, setDocType] = useState('Facture');
const [docNumber, setDocNumber] = useState('FAC-2024-001');
const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
const [logo, setLogo] = useState(null);
const [currency, setCurrency] = useState('MAD');
const [isGenerating, setIsGenerating] = useState(false);
const currencies = {
'MAD': { symbol: 'MAD', label: 'Dirham Marocain' },
'EUR': { symbol: '€', label: 'Euro' },
'USD': { symbol: '$', label: 'Dollar US' }
};
const [company, setCompany] = useState({
name: '',
address: '',
email: '',
phone: '',
ice: ''
});
const [client, setClient] = useState({
name: '',
address: '',
ice: ''
});
const [items, setItems] = useState([
{ id: 1, description: 'Prestation de service', quantity: 1, price: 0 }
]);
const [tvaRate, setTvaRate] = useState(20);
const [notes, setNotes] = useState('');
const subTotal = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
const tvaAmount = (subTotal * tvaRate) / 100;
const total = subTotal + tvaAmount;
const handleLogoChange = (e) => {
const file = e.target.files[0];
if (file) {
const reader = new FileReader();
reader.onloadend = () => setLogo(reader.result);
reader.readAsDataURL(file);
}
};
const addItem = () => {
setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0 }]);
};
const removeItem = (id) => {
if (items.length > 1) {
setItems(items.filter(item => item.id !== id));
}
};
const updateItem = (id, field, value) => {
setItems(items.map(item =>
item.id === id ? { ...item, [field]: value } : item
));
};
const formatMoney = (amount) => {
return amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' ' + currencies[currency].symbol;
};
const downloadPDF = async () => {
setIsGenerating(true);
const element = document.getElementById('invoice-document');
const opt = {
  margin: 0,
  filename: `${docType}_${docNumber || 'document'}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { 
    scale: 2, 
    useCORS: true, 
    letterRendering: true
  },
  jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
};

try {
  await html2pdf().set(opt).from(element).save();
} catch (error) {
  console.error('PDF Generation failed', error);
} finally {
  setIsGenerating(false);
}
};
return (
<div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
<nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between print:hidden">
<div className="flex items-center gap-2">
<div className="bg-indigo-600 p-2 rounded-lg">
<FileText className="text-white" size={20} />
</div>
<span className="font-bold text-lg tracking-tight">Facture<span className="text-indigo-600">Pro</span></span>
</div>
    <div className="flex items-center gap-3">
      <button 
        onClick={() => window.print()}
        className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition"
      >
        <Printer size={18} />
        Imprimer
      </button>
      <button 
        onClick={downloadPDF}
        disabled={isGenerating}
        className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2 rounded-lg font-semibold transition shadow-lg shadow-indigo-200 ${isGenerating ? 'cursor-wait' : ''}`}
      >
        {isGenerating ? (
          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Download size={18} />
        )}
        {isGenerating ? 'Génération...' : 'Télécharger PDF'}
      </button>
    </div>
  </nav>

  <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
    <aside className="lg:col-span-4 space-y-6 print:hidden">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
          <Settings size={14} />
          Configuration
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type de document</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              {['Facture', 'Devis'].map(type => (
                <button
                  key={type}
                  onClick={() => setDocType(type)}
                  className={`py-2 text-sm font-bold rounded-lg transition ${docType === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Devise</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition appearance-none"
              >
                {Object.keys(currencies).map(c => (
                  <option key={c} value={c}>{currencies[c].label} ({currencies[c].symbol})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">Taux TVA (%)</label>
            <input 
              type="number"
              value={tvaRate}
              onChange={(e) => setTvaRate(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
        </div>
      </div>
    </aside>

    <div className="lg:col-span-8 flex flex-col gap-4">
      <div 
        id="invoice-document"
        className="bg-white shadow-xl shadow-slate-200/60 md:rounded-3xl overflow-hidden print:shadow-none print:rounded-none"
        style={{ minHeight: '297mm', width: '100%' }}
      >
        <div className="h-3 bg-indigo-600 w-full" />
        
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-16">
            <div className="space-y-6 flex-1">
              <div className="relative group w-32 h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all hover:border-indigo-400 print:border-none">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="text-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                    <Camera className="mx-auto mb-2" size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Logo</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleLogoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer print:hidden" 
                />
              </div>
              
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Nom de votre entreprise"
                  className="text-2xl font-black block w-full outline-none focus:text-indigo-600 placeholder-slate-200"
                  value={company.name}
                  onChange={(e) => setCompany({...company, name: e.target.value})}
                />
                <textarea 
                  placeholder="Coordonnées (Adresse, Tel, ICE...)"
                  className="w-full text-slate-500 leading-relaxed resize-none outline-none text-sm h-24 placeholder-slate-200"
                  value={company.address}
                  onChange={(e) => setCompany({...company, address: e.target.value})}
                />
              </div>
            </div>

            <div className="text-right space-y-6">
              <div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">{docType}</h1>
                <p className="text-indigo-600 font-bold tracking-widest text-xs mt-2 uppercase">Document Officiel</p>
              </div>
              
              <div className="inline-block bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3 min-w-[200px]">
                <div className="flex items-center justify-end gap-3 border-b border-slate-200 pb-2">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Référence</span>
                  <input 
                    type="text" 
                    className="bg-transparent text-right outline-none font-bold text-slate-900 w-32"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-1">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Date</span>
                  <input 
                    type="date" 
                    className="bg-transparent text-right outline-none font-bold text-slate-900"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12 flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h3 className="flex items-center gap-2 text-indigo-600 text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                <User size={14} /> Facturer à
              </h3>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Nom du Client / Raison Sociale"
                  className="block w-full font-bold text-xl outline-none focus:text-indigo-600 placeholder-slate-200"
                  value={client.name}
                  onChange={(e) => setClient({...client, name: e.target.value})}
                />
                <textarea 
                  placeholder="Adresse complète et ICE du client..."
                  className="w-full text-slate-500 leading-relaxed resize-none outline-none text-sm h-24 placeholder-slate-200"
                  value={client.address}
                  onChange={(e) => setClient({...client, address: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="mb-10">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-4 px-2 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Désignation</th>
                  <th className="py-4 px-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 w-20">Qté</th>
                  <th className="py-4 px-2 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 w-32">Prix Unitaire</th>
                  <th className="py-4 px-2 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 w-32">Montant HT</th>
                  <th className="print:hidden w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-5 px-2">
                      <input 
                        type="text" 
                        placeholder="Description..."
                        className="w-full bg-transparent outline-none font-medium text-slate-800 placeholder-slate-200"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      />
                    </td>
                    <td className="py-5 px-2">
                      <input 
                        type="number" 
                        className="w-full bg-transparent text-center outline-none font-bold text-slate-800"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-5 px-2">
                      <input 
                        type="number" 
                        className="w-full bg-transparent text-right outline-none font-bold text-slate-800"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-5 px-2 text-right font-black text-slate-900">
                      {formatMoney(item.quantity * item.price)}
                    </td>
                    <td className="py-5 px-2 print:hidden text-center">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button 
              onClick={addItem}
              className="mt-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-black text-[10px] uppercase tracking-widest transition-all print:hidden"
            >
              <div className="bg-indigo-100 p-1 rounded-full"><Plus size={12} /></div>
              Ajouter un article
            </button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-10 pt-10 border-t border-slate-100">
            <div className="flex-1 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes & Instructions</h4>
              <textarea 
                placeholder="Notes..."
                className="w-full text-xs text-slate-500 leading-relaxed resize-none outline-none h-32 bg-slate-50 p-4 rounded-2xl border border-slate-100 focus:bg-white transition placeholder-slate-200"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="w-full md:w-72 space-y-3">
              <div className="flex justify-between items-center py-2 px-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Total HT</span>
                <span className="font-bold text-slate-900">{formatMoney(subTotal)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">TVA ({tvaRate}%)</span>
                <span className="font-bold text-slate-900">{formatMoney(tvaAmount)}</span>
              </div>
              <div className="pt-4 mt-2 border-t-2 border-slate-900 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="block font-black uppercase text-xs tracking-tighter text-slate-900">Net à Payer</span>
                  <span className="block text-[8px] text-indigo-600 font-bold uppercase tracking-widest">TTC</span>
                </div>
                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                  {formatMoney(total)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-24 pt-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[9px] text-slate-400 uppercase tracking-widest font-medium">
              Généré par FacturePro • Logiciel de facturation Express
            </div>
            <div className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
              Merci de votre confiance
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-slate-400 text-[10px] uppercase font-bold tracking-[0.3em] py-8 print:hidden">
        Document optimisé pour le format standard A4
      </p>
    </div>
  </main>

  <style>{`
    @media print {
      @page { margin: 0; size: A4; }
      body { background: white !important; -webkit-print-color-adjust: exact; }
      .print\\:hidden { display: none !important; }
      input, textarea { border: none !important; background: transparent !important; padding: 0 !important; }
      #invoice-document { width: 210mm !important; height: 297mm !important; box-shadow: none !important; margin: 0 !important; }
    }
  `}</style>
</div>
);
};
export default App;
</file_text>
</create_file>