package AssetTrack.service;

import AssetTrack.dto.UnidadeEstoqueRequestDTO;
import AssetTrack.dto.UnidadeEstoqueResponseDTO;
import AssetTrack.model.*;
import AssetTrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UnidadeEstoqueService {

    @Autowired private UnidadeEstoqueRepository unidadeRepository;
    @Autowired private ItemEstoqueRepository    itemRepository;
    @Autowired private SetorRepository          setorRepository;
    @Autowired private UsuarioRepository        usuarioRepository;

    public List<UnidadeEstoqueResponseDTO> listarPorItem(UUID idItem) {
        ItemEstoque item = itemRepository.findById(idItem)
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado."));
        return unidadeRepository.findByItemOrderByPatrimonioAsc(item).stream()
                .map(UnidadeEstoqueResponseDTO::new)
                .toList();
    }

    public List<UnidadeEstoqueResponseDTO> listarTodas() {
        return unidadeRepository.findAll().stream()
                .map(UnidadeEstoqueResponseDTO::new)
                .toList();
    }

    @Transactional
    public UnidadeEstoqueResponseDTO cadastrar(UnidadeEstoqueRequestDTO data) {
        ItemEstoque item = itemRepository.findById(data.idItem())
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado."));

        UnidadeEstoque u = new UnidadeEstoque();
        u.setItem(item);
        u.setPatrimonio(data.patrimonio());
        u.setEstado(data.estado() != null ? data.estado() : "DISPONIVEL");
        u.setObservacao(data.observacao());

        if (data.idSetor() != null)
            u.setSetor(setorRepository.findById(data.idSetor()).orElse(null));
        if (data.idUsuario() != null)
            u.setUsuario(usuarioRepository.findById(data.idUsuario()).orElse(null));

        unidadeRepository.save(u);
        return new UnidadeEstoqueResponseDTO(u);
    }

    @Transactional
    public UnidadeEstoqueResponseDTO atualizar(UUID id, UnidadeEstoqueRequestDTO data) {
        UnidadeEstoque u = unidadeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Unidade não encontrada."));

        u.setPatrimonio(data.patrimonio());
        u.setEstado(data.estado() != null ? data.estado() : u.getEstado());
        u.setObservacao(data.observacao());

        if (data.idSetor() != null)
            u.setSetor(setorRepository.findById(data.idSetor()).orElse(null));
        if (data.idUsuario() != null)
            u.setUsuario(usuarioRepository.findById(data.idUsuario()).orElse(null));

        unidadeRepository.save(u);
        return new UnidadeEstoqueResponseDTO(u);
    }

    @Transactional
    public void deletar(UUID id) {
        UnidadeEstoque u = unidadeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Unidade não encontrada."));
        unidadeRepository.delete(u);
    }
}