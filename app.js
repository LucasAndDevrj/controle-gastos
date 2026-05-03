// elementos da tela
let lista = document.getElementById("lista");
let total = document.getElementById("total");

// estado
let soma = 0;
let gastos = [];
let chart = null; // 🔥 IMPORTANTE (global)

// salvar dados
function salvarDados() {
  localStorage.setItem("gastos", JSON.stringify(gastos));
}

// carregar dados
let dadosSalvos = localStorage.getItem("gastos");

if (dadosSalvos) {
  gastos = JSON.parse(dadosSalvos);

  gastos.forEach(gasto => {
    criarElemento(gasto.descricao, gasto.valor);
  });

  atualizarGrafico(); // 🔥
}

// criar item na tela
function criarElemento(descricao, valor) {
  let li = document.createElement("li");

  li.innerHTML = `
    ${descricao} - R$ ${parseFloat(valor).toFixed(2)}
    <button class="remover">❌</button>
  `;

  lista.appendChild(li);

  soma += parseFloat(valor);
  total.textContent = soma.toFixed(2);

  let botaoRemover = li.querySelector(".remover");

  botaoRemover.onclick = function () {
    lista.removeChild(li);

    soma -= parseFloat(valor);
    total.textContent = soma.toFixed(2);

    gastos = gastos.filter(g => !(g.descricao === descricao && g.valor == valor));

    salvarDados();
    atualizarGrafico(); // 🔥
  };
}

// adicionar gasto
function adicionarGasto() {
  let descricao = document.getElementById("descricao").value;
  let valor = document.getElementById("valor").value;

  if (descricao === "" || valor === "") return;

  let gasto = {
    descricao: descricao,
    valor: valor
  };

  gastos.push(gasto);
  salvarDados();

  criarElemento(descricao, valor);

  atualizarGrafico(); // 🔥

  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
}

// gráfico pizza
function atualizarGrafico() {
  let canvas = document.getElementById("grafico");
  if (!canvas) return;

  let ctx = canvas.getContext("2d");

  let labels = gastos.map(g => g.descricao);
  let valores = gastos.map(g => parseFloat(g.valor));

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: valores,
        backgroundColor: [
          "#22c55e",
          "#3b82f6",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#14b8a6"
        ]
      }]
    }
  });
}