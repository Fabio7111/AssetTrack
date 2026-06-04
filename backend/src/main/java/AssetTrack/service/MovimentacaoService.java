package AssetTrack.service;

import AssetTrack.dto.MovimentacaoRequestDTO;
import AssetTrack.dto.MovimentacaoResponseDTO;
import AssetTrack.model.Equipamento;
import AssetTrack.model.Movimentacao;
import AssetTrack.model.Setor;
import AssetTrack.model.Usuario;
import AssetTrack.repository.EquipamentoRepository;
import AssetTrack.repository.MovimentacaoRepository;
import AssetTrack.repository.SetorRepository;
import AssetTrack.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class MovimentacaoService {

    @Autowired private MovimentacaoRepository movimentacaoRepository;
    @Autowired private EquipamentoRepository equipamentoRepository;
    @Autowired private SetorRepository setorRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    @Transactional
    public MovimentacaoResponseDTO transferirEquipamento(MovimentacaoRequestDTO data) {
        Equipamento equipamento = equipamentoRepository.findById(data.idEquipamento())
                .orElseThrow(() -> new IllegalArgumentException("Equipamento não encontrado."));

        Setor setorDestino = setorRepository.findById(data.idSetorDestino())
                .orElseThrow(() -> new IllegalArgumentException("Setor de destino não encontrado."));

        Usuario responsavel = usuarioRepository.findById(data.idUsuarioResponsavel())
                .orElseThrow(() -> new IllegalArgumentException("Usuário responsável não encontrado."));

        if (equipamento.getSetor() != null && equipamento.getSetor().getIdSetor().equals(setorDestino.getIdSetor())) {
            throw new IllegalArgumentException("O equipamento já está alocado neste setor.");
        }

        Movimentacao movimentacao = new Movimentacao();
        movimentacao.setEquipamento(equipamento);
        movimentacao.setSetorOrigem(equipamento.getSetor());
        movimentacao.setSetorDestino(setorDestino);
        movimentacao.setResponsavel(responsavel);
        movimentacao.setDataMovimentacao(LocalDateTime.now());
        movimentacao.setObservacao(data.observacao());

        equipamento.setSetor(setorDestino);

        equipamentoRepository.save(equipamento);
        movimentacaoRepository.save(movimentacao);

        return new MovimentacaoResponseDTO(movimentacao);
    }
}