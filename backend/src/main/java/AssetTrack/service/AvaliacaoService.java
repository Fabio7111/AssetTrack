package AssetTrack.service;

import AssetTrack.dto.AvaliacaoRequestDTO;
import AssetTrack.model.*;
import AssetTrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AvaliacaoService {

    @Autowired private AvaliacaoRepository                avaliacaoRepository;
    @Autowired private SolicitacaoManutencaoRepository    manutencaoRepository;
    @Autowired private SolicitacaoEstoqueRepository       estoqueRepository;

    @Transactional
    public void avaliar(AvaliacaoRequestDTO data, Usuario avaliador) {
        if (data.notaServico() == null || data.notaServico() < 1 || data.notaServico() > 5)
            throw new IllegalArgumentException("A nota deve ser entre 1 e 5.");

        if (data.idSolicitacaoManutencao() == null && data.idSolicitacaoEstoque() == null)
            throw new IllegalArgumentException("Informe a solicitação a ser avaliada.");

        Avaliacao a = new Avaliacao();
        a.setNotaServico(data.notaServico());
        a.setComentarios(data.comentarios());
        a.setAvaliador(avaliador);

        if (data.idSolicitacaoManutencao() != null) {
            SolicitacaoManutencao s = manutencaoRepository.findById(data.idSolicitacaoManutencao())
                    .orElseThrow(() -> new IllegalArgumentException("Solicitação de manutenção não encontrada."));
            if (avaliacaoRepository.findBySolicitacaoManutencao_IdSolicitacaoManutencao(s.getIdSolicitacaoManutencao()) != null)
                throw new IllegalStateException("Esta solicitação já foi avaliada.");
            a.setSolicitacaoManutencao(s);
        } else {
            SolicitacaoEstoque s = estoqueRepository.findById(data.idSolicitacaoEstoque())
                    .orElseThrow(() -> new IllegalArgumentException("Solicitação de estoque não encontrada."));
            if (avaliacaoRepository.findBySolicitacaoEstoque_IdSolicitacaoEstoque(s.getIdSolicitacaoEstoque()) != null)
                throw new IllegalStateException("Esta solicitação já foi avaliada.");
            a.setSolicitacaoEstoque(s);
        }

        avaliacaoRepository.save(a);
    }
}