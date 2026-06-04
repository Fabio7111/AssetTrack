package AssetTrack.service;

import AssetTrack.dto.AvaliacaoRequestDTO;
import AssetTrack.dto.SolicitacaoRequestDTO;
import AssetTrack.dto.SolicitacaoResponseDTO;
import AssetTrack.model.Avaliacao;
import AssetTrack.model.Equipamento;
import AssetTrack.model.Manutencao;
import AssetTrack.model.SolicitacaoManutencao;
import AssetTrack.model.Usuario;
import AssetTrack.repository.AvaliacaoRepository;
import AssetTrack.repository.EquipamentoRepository;
import AssetTrack.repository.ManutencaoRepository;
import AssetTrack.repository.SolicitacaoManutencaoRepository;
import AssetTrack.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ManutencaoService {

    @Autowired private SolicitacaoManutencaoRepository solicitacaoRepository;
    @Autowired private EquipamentoRepository equipamentoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private AvaliacaoRepository avaliacaoRepository;
    @Autowired private ManutencaoRepository manutencaoRepository;

    @Transactional
    public SolicitacaoResponseDTO abrirSolicitacao(SolicitacaoRequestDTO data) {
        Equipamento equipamento = equipamentoRepository.findById(data.idEquipamento())
                .orElseThrow(() -> new IllegalArgumentException("Equipamento não encontrado."));

        Usuario solicitante = usuarioRepository.findById(data.idUsuarioSolicitante())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        SolicitacaoManutencao solicitacao = new SolicitacaoManutencao();
        solicitacao.setEquipamento(equipamento);
        solicitacao.setUsuarioSolicitante(solicitante);
        solicitacao.setDescricaoProblema(data.descricaoProblema());
        solicitacao.setStatusSolicitacao("PENDENTE");
        solicitacao.setDataAbertura(LocalDateTime.now());

        equipamento.setStatusAtual("EM MANUTENCAO");
        equipamentoRepository.save(equipamento);

        solicitacaoRepository.save(solicitacao);
        return new SolicitacaoResponseDTO(solicitacao);
    }

    @Transactional
    public SolicitacaoResponseDTO atualizarStatus(UUID idSolicitacao, String novoStatus) {
        SolicitacaoManutencao solicitacao = solicitacaoRepository.findById(idSolicitacao)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada."));

        solicitacao.setStatusSolicitacao(novoStatus.toUpperCase());

        if (novoStatus.equalsIgnoreCase("CONCLUIDO")) {
            Equipamento eq = solicitacao.getEquipamento();
            eq.setStatusAtual("ATIVO");
            equipamentoRepository.save(eq);
        }

        solicitacaoRepository.save(solicitacao);
        return new SolicitacaoResponseDTO(solicitacao);
    }

    @Transactional
    public Avaliacao gravarAvaliacao(AvaliacaoRequestDTO data) {
        if (data.notaServico() < 1 || data.notaServico() > 5) {
            throw new IllegalArgumentException("A nota do serviço deve estar entre 1 e 5.");
        }

        Manutencao manutencao = manutencaoRepository.findById(data.idManutencao())
                .orElseThrow(() -> new IllegalArgumentException("Registro de manutenção não encontrado."));

        Usuario avaliador = usuarioRepository.findById(data.idUsuarioAvaliador())
                .orElseThrow(() -> new IllegalArgumentException("Usuário avaliador não encontrado."));

        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setManutencao(manutencao);
        avaliacao.setAvaliador(avaliador);
        avaliacao.setNotaServico(data.notaServico());
        avaliacao.setComentarios(data.comentarios());
        avaliacao.setDataAvaliacao(LocalDateTime.now());

        return avaliacaoRepository.save(avaliacao);
    }
}