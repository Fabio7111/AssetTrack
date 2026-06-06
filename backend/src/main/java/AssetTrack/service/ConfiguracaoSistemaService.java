package AssetTrack.service;

import AssetTrack.dto.ConfiguracaoSistemaRequestDTO;
import AssetTrack.dto.ConfiguracaoSistemaResponseDTO;
import AssetTrack.model.ConfiguracaoSistema;
import AssetTrack.repository.ConfiguracaoSistemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ConfiguracaoSistemaService {

    @Autowired
    private ConfiguracaoSistemaRepository repository;

    public ConfiguracaoSistemaResponseDTO getConfiguracao() {
        ConfiguracaoSistema config = repository.findAll().stream()
                .findFirst()
                .orElseGet(() -> {
                    ConfiguracaoSistema novaConfig = new ConfiguracaoSistema();
                    novaConfig.setNomeOrganizacao("Unimed Assis");
                    novaConfig.setTelefone("(00) 00000-0000");
                    novaConfig.setEmailSuporte("suporte@unimedassis.com.br");
                    novaConfig.setAlertaBaixoEstoque(true);
                    novaConfig.setAlertaDevolucaoAtrasada(true);
                    return repository.save(novaConfig);
                });

        return new ConfiguracaoSistemaResponseDTO(config);
    }

    @Transactional
    public ConfiguracaoSistemaResponseDTO atualizarConfiguracao(ConfiguracaoSistemaRequestDTO dados) {
        ConfiguracaoSistema config = repository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Configurações do sistema não encontradas."));

        config.setNomeOrganizacao(dados.nomeOrganizacao());
        config.setTelefone(dados.telefone());
        config.setEmailSuporte(dados.emailSuporte());

        if (dados.alertaBaixoEstoque() != null) {
            config.setAlertaBaixoEstoque(dados.alertaBaixoEstoque());
        }
        if (dados.alertaDevolucaoAtrasada() != null) {
            config.setAlertaDevolucaoAtrasada(dados.alertaDevolucaoAtrasada());
        }

        ConfiguracaoSistema configAtualizada = repository.save(config);
        return new ConfiguracaoSistemaResponseDTO(configAtualizada);
    }
}