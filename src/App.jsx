import { useMemo, useState } from "react";
import repertorio from "./repertorio.json";

const INSTAGRAM_URL = "https://instagram.com/o.gabss";
const WHATSAPP_URL = "https://wa.me/5543996316782";

const VIDEOS = [
  { title: "O BÊBADO E O EQUILIBRISTA - ELIS REGINA", youtubeId: "XIstQy-95Y4" },
  { title: "BOA SORTE - VANESSA DA MATA", youtubeId: "IEUVbuzACao" },
  { title: "HIT THE ROAD JACK - RAY CHARLES", youtubeId: "X00oXFyAegk" },
  { title: "ANUNCIAÇÃO/EU SÓ QUERO UM XODÓ", youtubeId: "k1oREZbimtE" },
];

function App() {
  const BASE = import.meta.env.BASE_URL;

  // Seção 1 (pedido livre)
  const [pedidoLivre, setPedidoLivre] = useState("");

  // Seção 2 (busca + filtros)
  const [busca, setBusca] = useState("");
  const [filtroArtista, setFiltroArtista] = useState("Todos");
  const [filtroEstilo, setFiltroEstilo] = useState("Todos");

  // Modal
  const [pedidoAtual, setPedidoAtual] = useState(null);
  const [mensagemModal, setMensagemModal] = useState("");
  const [status, setStatus] = useState("");

  const artistas = useMemo(() => {
    const set = new Set(repertorio.map((m) => m.artista).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const estilos = useMemo(() => {
    const set = new Set(repertorio.map((m) => m.estilo).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const resultados = useMemo(() => {
    const q = busca.trim().toLowerCase();

    const filtrado = repertorio.filter((m) => {
      const okArtista = filtroArtista === "Todos" ? true : m.artista === filtroArtista;
      const okEstilo = filtroEstilo === "Todos" ? true : m.estilo === filtroEstilo;

      if (!q) return okArtista && okEstilo;

      const texto = `${m.nome} ${m.artista} ${m.estilo} ${m.letra}`.toLowerCase();
      return okArtista && okEstilo && texto.includes(q);
    });

    return filtrado;
  }, [busca, filtroArtista, filtroEstilo]);

  const abrirModalPedido = (payload) => {
    setPedidoAtual(payload);
    setMensagemModal("");
    setStatus("");
  };

  const fecharModalPedido = () => {
    setPedidoAtual(null);
    setMensagemModal("");
    setStatus("");
  };

  const pedirDaSecao1 = () => {
    const texto = pedidoLivre.trim();
    if (!texto) return;

    abrirModalPedido({
      origem: "livre",
      musicaFinal: texto,
      detalhe: "Pedido digitado",
    });
  };

  const pedirDaLista = (m) => {
    abrirModalPedido({
      origem: "lista",
      musicaFinal: `${m.nome} — ${m.artista}`,
      detalhe: `${m.estilo || "—"}`,
    });
  };

  const enviarPedido = async () => {
    const SUPABASE_FUNCTION_URL =
      "https://dkzkutpbtkysebhunjrf.supabase.co/functions/v1/pedido";

    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    try {
      const resp = await fetch(SUPABASE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY, // ✅ só isso
        },
        body: JSON.stringify({
          pedido: pedidoAtual?.musicaFinal || "",
          mensagem: mensagemModal || "",
        }),
      });

      if (!resp.ok) throw new Error(await resp.text());

      setStatus("✅ Pedido enviado!");
      setTimeout(() => fecharModalPedido(), 600);
    } catch (e) {
      setStatus("❌ Falha ao enviar.");
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-5 py-8">
        {/* HERO / HEADER */}
        <header className="border-zinc-800">
          <div className="max-w-3xl mx-auto px-5 py-8 grid md:grid-cols-2 gap-6 items-center">
            {/* TEXTO */}
            <div>
              <img
                src={`${BASE}img/logo.png`}
                alt="Gabs Acústico"
                className="h-auto w-auto"
              />

              <p className="text-zinc-400 italic text-center mt-6">
                Momentos marcantes têm trilha sonora!
              </p>

              {/* REDES */}
              <div className="flex gap-3 mt-6 justify-center">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl border border-zinc-800 hover:bg-zinc-900/40 transition"
                >
                  <img
                    src={`${BASE}img/instagram.png`}
                    className="w-7 h-7"
                    alt="Instagram"
                  />
                </a>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl border border-zinc-800 hover:bg-zinc-900/40 transition"
                >
                  <img
                    src={`${BASE}img/whatsapp.png`}
                    className="w-7 h-7"
                    alt="WhatsApp"
                  />
                </a>
              </div>
            </div>

            {/* FOTO */}
            <div className="w-full max-w-[360px] h-[280px] rounded-2xl border border-zinc-800 overflow-hidden mx-auto">
              <img
                src={`${BASE}img/cabecalho.webp`}
                alt="Gabs"
                className="w-full h-full object-cover object-top scale-125 opacity-80"
              />
            </div>
          </div>
        </header>

        {/* SEÇÃO 1: PEDIDO LIVRE */}
        <section className="bg-zinc-950/40 border border-zinc-800 rounded-2xl p-5 mb-6">
          <h2 className="text-xl font-semibold mb-2">Peça sua música:</h2>
          <p className="text-sm text-zinc-400 mb-4">
            Digite a música que você quer e clique em Pedir. Você pode (ou não) escrever uma
            mensagem depois.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 outline-none focus:border-zinc-600"
              placeholder="Qual música você quer?"
              value={pedidoLivre}
              onChange={(e) => setPedidoLivre(e.target.value)}
            />

            <button
              onClick={pedirDaSecao1}
              className="shrink-0 px-4 py-3 rounded-xl bg-green-500 text-black font-semibold hover:opacity-90 disabled:opacity-40"
              disabled={!pedidoLivre.trim()}
            >
              Pedir
            </button>
          </div>
        </section>

        {/* SEÇÃO 2: BUSCA + FILTROS + LISTA */}
        <section
          className="relative border border-zinc-800 rounded-2xl p-5 mb-10 overflow-hidden"
          style={{
            backgroundImage: `url(${BASE}img/repertorio-bg.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/80" />
          <div className="relative">
            <h2 className="text-xl font-semibold mb-4">Buscar no repertório</h2>

            <input
              className="w-full p-4 text-lg rounded-2xl bg-zinc-900 border border-zinc-800 outline-none focus:border-zinc-600"
              placeholder="Buscar por música, artista, estilo ou letra..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <select
                className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 outline-none focus:border-zinc-600"
                value={filtroArtista}
                onChange={(e) => setFiltroArtista(e.target.value)}
              >
                <option value="Todos">Filtrar Cantor</option>
                {artistas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>

              <select
                className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 outline-none focus:border-zinc-600"
                value={filtroEstilo}
                onChange={(e) => setFiltroEstilo(e.target.value)}
              >
                <option value="Todos">Filtrar Estilo</option>
                {estilos.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
              <span>{resultados.length} músicas encontradas</span>
            </div>

            <ul className="mt-2 divide-y divide-zinc-800 max-h-[420px] overflow-y-auto pr-2">
              {resultados.map((m) => (
                <li key={m.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{m.nome}</p>
                    <p className="text-zinc-400 text-sm truncate">
                      {m.artista} • {m.estilo}
                    </p>
                  </div>

                  <button
                    className="shrink-0 px-3 py-2 rounded-xl bg-green-500 text-black text-sm font-semibold hover:opacity-90"
                    onClick={() => pedirDaLista(m)}
                  >
                    Pedir
                  </button>
                </li>
              ))}

              {resultados.length === 0 && (
                <li className="py-6 text-zinc-400 text-sm">
                  Nada encontrado. Tente outro termo 🙂\
                </li>
              )}
            </ul>
          </div>
        </section>

        {/* VÍDEOS */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Vídeos</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {VIDEOS.slice(0, 4).map((v) => (
              <div
                key={v.youtubeId}
                className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/30"
              >
                <iframe
                  loading="lazy"
                  className="w-full aspect-[9/16]"
                  src={`https://www.youtube.com/embed/${v.youtubeId}`}
                  title={v.title}
                  allowFullScreen
                />
                <div className="p-3">
                  <p className="text-center font-semibold text-zinc-300">{v.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SOBRE MIM */}
        <section className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 mb-10">
          <div className="grid md:grid-cols-3 gap-5 items-stretch">
            <div className="md:col-span-1 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950/40">
              <img
                src={`${BASE}img/sobre.webp`}
                alt="Gabs Acústico"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 text-zinc-200 leading-relaxed">
              <p className="text-lg font-semibold mb-4 text-center">Olá! 😁</p>

              <p>
                Meu nome é Gabriel, mas pode me chamar de Gabs. A música é um hobby essencial
                para mim — uma forma de aliviar as tensões das aventuras da vida.
              </p>

              <p className="mt-4">
                Cresci em Cotia/SP, mas a vida tem me levado a explorar novos lugares, ainda sem
                saber onde vou cravar as minhas raízes. Atualmente em Londrina/PR.
              </p>

              <p className="mt-4">
                No dia a dia sou bem eclético, mas os estilos musicais que mais gosto de reproduzir são:
                MPB, Bossa Nova, Pop/Rock nacional e internacional.
              </p>

              <p className="mt-4 font-medium">
                Tem alguma sugestão, mensagem ou quer me contratar? Entre em contato pela área de pedidos
                ou pelas minhas redes sociais — isso me ajuda muito!
              </p>

              <p className="mt-6 text-center text-zinc-300 font-semibold">
                Espero que esteja curtindo o meu som! 🎶 🎵 🎤 🎸
              </p>
            </div>
          </div>
        </section>

        {/* MODAL */}
        {pedidoAtual && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">Confirmar pedido</h3>
                  <p className="text-zinc-400 text-sm mt-1 break-words">
                    {pedidoAtual.musicaFinal}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">{pedidoAtual.detalhe}</p>
                </div>

                <button onClick={fecharModalPedido} className="text-zinc-400 hover:text-white">
                  ✕
                </button>
              </div>

              <textarea
                className="w-full mt-4 p-3 rounded-xl bg-zinc-900 border border-zinc-800 outline-none focus:border-zinc-600 resize-none"
                rows={3}
                placeholder="Mensagem opcional (ex.: mesa 3, aniversário, etc.)"
                value={mensagemModal}
                onChange={(e) => setMensagemModal(e.target.value)}
              />

              {status && <div className="mt-3 text-sm text-zinc-300">{status}</div>}

              <div className="mt-5 flex gap-3 justify-end">
                <button
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-sm"
                  onClick={fecharModalPedido}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-green-500 text-black font-semibold text-sm hover:opacity-90"
                  onClick={enviarPedido}
                >
                  Enviar pedido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
