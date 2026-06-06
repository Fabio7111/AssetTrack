package AssetTrack.service;

import AssetTrack.dto.MovimentacaoEstoqueRequestDTO;
import AssetTrack.dto.MovimentacaoEstoqueResponseDTO;
import AssetTrack.model.*;
import AssetTrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class MovimentacaoEstoqueService {

    @Autowired private MovimentacaoEstoqueRepository movimentacaoRepository;
    @Autowired private ItemEstoqueRepository         itemRepository;
    @Autowired private UnidadeEstoqueRepository      unidadeRepository;
    @Autowired private SetorRepository               setorRepository;

    public List<MovimentacaoEstoqueResponseDTO> listarTodas() {
        return movimentacaoRepository.findAllByOrderByDataHoraDesc().stream()
                .map(MovimentacaoEstoqueResponseDTO::new)
                .toList();
    }

    public List<MovimentacaoEstoqueResponseDTO> listarPorItem(UUID idItem) {
        return movimentacaoRepository.findByItem_IdItemOrderByDataHoraDesc(idItem).stream()
                .map(MovimentacaoEstoqueResponseDTO::new)
                .toList();
    }

    @Transactional
    public MovimentacaoEstoqueResponseDTO registrar(MovimentacaoEstoqueRequestDTO data, Usuario usuarioLogado) {
        ItemEstoque item = itemRepository.findById(data.idItem())
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado."));

        int qtd = data.quantidade() != null ? data.quantidade() : 1;

        if ("SAIDA".equalsIgnoreCase(data.tipo())) {
            if (item.getQuantidadeDisponivel() < qtd)
                throw new IllegalArgumentException(
                        "Quantidade insuficiente. Disponível: " + item.getQuantidadeDisponivel());
            item.setQuantidadeDisponivel(item.getQuantidadeDisponivel() - qtd);
        } else {
            item.setQuantidadeDisponivel(item.getQuantidadeDisponivel() + qtd);
        }

        int novaQtd = item.getQuantidadeDisponivel();
        if (novaQtd == 0)       item.setStatus("ESGOTADO");
        else if (novaQtd <= 3)  item.setStatus("BAIXO_ESTOQUE");
        else                    item.setStatus("DISPONIVEL");
        itemRepository.save(item);

        MovimentacaoEstoque mov = new MovimentacaoEstoque();
        mov.setItem(item);
        mov.setTipo(data.tipo().toUpperCase());
        mov.setQuantidade(qtd);
        mov.setUsuario(usuarioLogado);
        mov.setObservacao(data.observacao());

        if (data.idUnidade() != null)
            mov.setUnidade(unidadeRepository.findById(data.idUnidade()).orElse(null));

        if (data.idSetor() != null)
            mov.setSetor(setorRepository.findById(data.idSetor()).orElse(null));

        movimentacaoRepository.save(mov);
        return new MovimentacaoEstoqueResponseDTO(mov);
    }
}