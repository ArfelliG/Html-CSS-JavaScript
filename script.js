const form = document.getElementById("form-tarefa");
        const input = document.getElementById("input-tarefa");
        const lista = document.getElementById("lista");
        const vazio = document.getElementById("vazio");
        const contador = document.getElementById("contador");
        const botaoLimpar = document.getElementById("limpar");
        const botoesFiltro = document.querySelectorAll(".filtro");

      
        let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
        let filtroAtual = "todas";

        
        function salvar() {
            localStorage.setItem("tarefas", JSON.stringify(tarefas));
        }

 
        function adicionarTarefa(texto) {
            const tarefa = {
                id: Date.now(),
                texto: texto,
                concluida: false
            };

            tarefas.push(tarefa);
            salvar();
            renderizar();
        }

 
        function alternarTarefa(id) {
            tarefas = tarefas.map((t) =>
                t.id === id
                    ? { ...t, concluida: !t.concluida }
                    : t
            );

            salvar();
            renderizar();
        }

      
        function removerTarefa(id) {
            tarefas = tarefas.filter((t) => t.id !== id);

            salvar();
            renderizar();
        }

       
        function limparConcluidas() {
            tarefas = tarefas.filter((t) => !t.concluida);

            salvar();
            renderizar();
        }

      
        function tarefasFiltradas() {
            if (filtroAtual === "pendentes") {
                return tarefas.filter((t) => !t.concluida);
            }

            if (filtroAtual === "concluidas") {
                return tarefas.filter((t) => t.concluida);
            }

            return tarefas;
        }


        function criarItem(tarefa) {
            const li = document.createElement("li");

            li.className = "item" +
                (tarefa.concluida ? " concluida" : "");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = tarefa.concluida;
            checkbox.setAttribute("aria-label", "Concluir tarefa");

            checkbox.addEventListener("change", () => {
                alternarTarefa(tarefa.id);
            });

            const texto = document.createElement("span");
            texto.className = "texto";
            texto.textContent = tarefa.texto;

            const remover = document.createElement("button");
            remover.type = "button";
            remover.className = "remover";
            remover.innerHTML = "&times;";
            remover.setAttribute("aria-label", "Remover tarefa");

            remover.addEventListener("click", () => {
                removerTarefa(tarefa.id);
            });

            li.append(checkbox, texto, remover);

            return li;
        }

     
        function renderizar() {
            lista.innerHTML = "";

            const visiveis = tarefasFiltradas();

            visiveis.forEach((tarefa) => {
                lista.appendChild(criarItem(tarefa));
            });

            vazio.hidden = visiveis.length !== 0;

            const pendentes = tarefas.filter(
                (t) => !t.concluida
            ).length;

            contador.textContent =
                pendentes === 1
                    ? "1 tarefa pendente"
                    : `${pendentes} tarefas pendentes`;
        }

        // Evento de envio do formulário
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const texto = input.value.trim();

            if (texto === "") {
                return;
            }

            adicionarTarefa(texto);

            input.value = "";
            input.focus();
        });

        // Eventos dos filtros
        botoesFiltro.forEach((botao) => {
            botao.addEventListener("click", () => {
                filtroAtual = botao.dataset.filtro;

                botoesFiltro.forEach((b) => {
                    b.classList.remove("ativo");
                });

                botao.classList.add("ativo");

                renderizar();
            });
        });

        // Evento do botão para limpar tarefas concluídas
        botaoLimpar.addEventListener("click", limparConcluidas);

        // Primeira renderização ao abrir a página
        renderizar();