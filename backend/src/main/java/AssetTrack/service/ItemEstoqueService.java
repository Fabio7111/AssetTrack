package AssetTrack.service;

import AssetTrack.dto.ItemEstoqueRequestDTO;
import AssetTrack.dto.ItemEstoqueResponseDTO;
import AssetTrack.model.ItemEstoque;
import AssetTrack.repository.ItemEstoqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ItemEstoqueService {

    @Autowired
    private ItemEstoqueRepository repository;

    public List<ItemEstoqueResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(ItemEstoqueResponseDTO::new)
                .toList();
    }

    public ItemEstoqueResponseDTO buscarPorId(UUID id) {
        ItemEstoque item = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado: " + id));
        return new ItemEstoqueResponseDTO(item);
    }

    @Transactional
    public ItemEstoqueResponseDTO cadastrar(ItemEstoqueRequestDTO data) {
        ItemEstoque item = new ItemEstoque();
        preencherCampos(item, data);
        repository.save(item);
        return new ItemEstoqueResponseDTO(item);
    }

    @Transactional
    public ItemEstoqueResponseDTO atualizar(UUID id, ItemEstoqueRequestDTO data) {
        ItemEstoque item = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado: " + id));
        preencherCampos(item, data);
        repository.save(item);
        return new ItemEstoqueResponseDTO(item);
    }

    @Transactional
    public void deletar(UUID id) {
        ItemEstoque item = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado: " + id));
        repository.delete(item);
    }


    private void preencherCampos(ItemEstoque item, ItemEstoqueRequestDTO data) {
        item.setNomeItem(data.nomeItem());
        item.setCategoria(data.categoria());
        item.setQuantidadeDisponivel(data.quantidadeDisponivel() != null ? data.quantidadeDisponivel() : 0);
        item.setLocalizacao(data.localizacao());
        item.setStatus(resolverStatus(data.status(), data.quantidadeDisponivel()));

        if (data.imagemBase64() != null) {
            item.setImagemBase64(data.imagemBase64());
        }
    }

    private String resolverStatus(String statusInformado, Integer qtd) {
        if (statusInformado != null && !statusInformado.isBlank()) return statusInformado;
        if (qtd == null || qtd == 0) return "ESGOTADO";
        if (qtd <= 3) return "BAIXO_ESTOQUE";
        return "DISPONIVEL";
    }
}