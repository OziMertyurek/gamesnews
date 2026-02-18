export default function ContactPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Iletisim</h1>
        <p className="text-gray-400 mt-2">Reklam, sponsorluk ve is birligi teklifleri icin bize ulasabilirsiniz.</p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <article className="card p-6 space-y-3">
          <h2 className="text-xl text-white font-semibold">Iletisim Bilgileri</h2>
          <p className="text-gray-300"><span className="text-gray-400">Adres:</span> Barbaros Mah. Teknoloji Cad. No: 42, Atasehir / Istanbul</p>
          <p className="text-gray-300"><span className="text-gray-400">E-posta:</span> iletisim@allaroundgames.com</p>
          <p className="text-gray-300"><span className="text-gray-400">Telefon:</span> +90 212 555 14 14</p>
          <div className="rounded-lg border border-blue-800 bg-blue-950/20 p-4 mt-4">
            <p className="text-sm text-blue-300">Buraya reklam vermek icin bizimle iletisime gecin.</p>
          </div>
        </article>

        <article className="card p-3 overflow-hidden">
          <iframe
            title="allaroundgames Ofis Konumu"
            src="https://www.google.com/maps?q=Barbaros+Mahallesi+Atasehir+Istanbul&output=embed"
            className="w-full h-[380px] rounded-lg border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </article>
      </section>

      <section className="card p-6 border-dashed border-gray-700">
        <h3 className="text-lg text-white font-semibold">Reklam Alanlari</h3>
        <p className="text-gray-400 mt-2">Ana sayfa banner, kategori ici kart, urun listeleme vitrini ve mobil sabit bant secenekleri bulunur.</p>
        <p className="text-blue-300 mt-3">Buraya reklam vermek icin bizimle iletisime gecin: iletisim@allaroundgames.com</p>
      </section>
    </div>
  )
}
